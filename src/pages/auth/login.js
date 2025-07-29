import { Link } from "react-router-dom";
import Layout from "../../components/layout/layout";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import loginSchema from "../schemas/loginSchema";
import { login } from "../../api/internal";
import { setUser } from "../../store/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../loader/loadingButton";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { FiEye, FiEyeOff, FiMail, FiPhone, FiLock } from "react-icons/fi";

const Login = () => {
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const [eye, setEye] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (values.isRememberMe) {
            localStorage.setItem("rememberEmail", values.user);
            localStorage.setItem("rememberPassword", values.password);
        } else {
            localStorage.removeItem("rememberEmail");
            localStorage.removeItem("rememberPassword");
        }
        setLoading(true);
        const data = {
            user: values.user,
            password: values.password,
        };

        const response = await login(data);
        if (response.status === 201) {
            setLoading(false);
            const user = {
                _id: response.data.user._id,
                email: response.data.user.email,
                username: response.data.user.name,
                phone: response.data.user.phone,
                address: response.data.user.address,
                auth: response.data.auth,
                role: response.data.user.role,
                province: response.data.user.province,
                city: response.data.user.city,
                photo: response.data.user.photo
            };
            dispatch(setUser(user));
            navigate("/admin/my-account");
        } else if (response.code === "ERR_BAD_REQUEST") {
            setLoading(false);
            toast.error(response.response.data.message);
            console.log("Error while logging in " + response.response.data.message);
        }
    };

    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberEmail");
        const savedPassword = localStorage.getItem("rememberPassword");
        if (savedEmail && savedPassword) {
            setFieldValue("user", savedEmail);
            setFieldValue("password", savedPassword);
            setFieldValue("isRememberMe", true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { values, touched, handleBlur, handleChange, errors, setFieldValue } = useFormik({
        initialValues: {
            user: "",
            password: "",
            isRememberMe: false,
        },
        validationSchema: loginSchema,
    });

    const Password = (e) => {
        if (e.length > 0) {
            setShow(true);
        } else {
            setShow(false);
        }
    };

    const showPass = () => {
        if (eye === false) {
            setEye(true);
            document.getElementById("password").setAttribute("type", "text");
        } else {
            setEye(false);
            document.getElementById("password").setAttribute("type", "password");
        }
    };
    
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            const googleData = {
                user: decoded.email,
                name: decoded.name,
                googleId: decoded.sub,
                picture: decoded.picture,
            };

            const response = await login(googleData);

            if (response.status === 201) {
                const user = {
                    _id: response.data.user._id,
                    email: response.data.user.email,
                    username: response.data.user.name,
                    phone: response.data.user.phone,
                    address: response.data.user.address,
                    auth: response.data.auth,
                    role: response.data.user.role,
                };
                dispatch(setUser(user));
                navigate("/admin/my-account");
            } else {
                toast.error("Google login failed.");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred during Google login.");
        }
    };

    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden backdrop-filter backdrop-blur-lg bg-opacity-80 border border-white border-opacity-30">
                        <div className="p-8">
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
                                <p className="text-gray-600 mt-2">Login to access your account</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            {values.user.includes('@') ? (
                                                <FiMail className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <FiPhone className="h-5 w-5 text-gray-400" />
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            name="user"
                                            onChange={handleChange}
                                            value={values.user}
                                            onBlur={handleBlur}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Email or Phone Number"
                                        />
                                        {errors.email && touched.email && (
                                            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                        )}
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiLock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.password}
                                            className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Password"
                                        />
                                        {show && (
                                            <button
                                                type="button"
                                                onClick={showPass}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            >
                                                {eye ? (
                                                    <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                                ) : (
                                                    <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="isRememberMe"
                                            type="checkbox"
                                            checked={values.isRememberMe}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                            Remember me
                                        </label>
                                    </div>

                                    <div className="text-sm">
                                        <Link to="/forgotpassword" className="font-medium text-blue-600 hover:text-blue-500">
                                            Forgot password?
                                        </Link>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                                    >
                                        <LoadingButton loading={loading} title="Sign In" />
                                    </button>
                                </div>

                                {error && (
                                    <div className="text-center text-sm text-red-500">
                                        {error}
                                    </div>
                                )}
                            </form>

                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-1 gap-3">
                                    <div className="flex justify-center">
                                        <GoogleLogin
                                            onSuccess={handleGoogleSuccess}
                                            onError={() => toast.error("Google login failed.")}
                                            shape="pill"
                                            theme="filled_blue"
                                            size="large"
                                            text="continue_with"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Login;
