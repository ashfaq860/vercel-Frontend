import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import Layout from "../../components/layout/layout";
import loginSchema from "../schemas/loginSchema";
import { login } from "../../api/internal";
import { setUser } from "../../store/userSlice";
import LoadingButton from "../loader/loadingButton";

const Login = () => {
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Formik setup
    const { values, touched, handleBlur, handleChange, errors, setFieldValue } = useFormik({
        initialValues: {
            user: "",
            password: "",
            isRememberMe: false,
        },
        validationSchema: loginSchema,
    });

    // Load remembered credentials
    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberEmail");
        const savedPassword = localStorage.getItem("rememberPassword");
        if (savedEmail && savedPassword) {
            setFieldValue("user", savedEmail);
            setFieldValue("password", savedPassword);
            setFieldValue("isRememberMe", true);
        }
    }, [setFieldValue]);

    const handleLogin = async (e) => {
        e.preventDefault();
        
        // Handle remember me functionality
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

        try {
            const response = await login(data);
            if (response.status === 201) {
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
            }
        } catch (error) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Login failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
                    {/* Decorative header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8">
                        <h1 className="text-2xl font-bold text-white text-center">Welcome Back</h1>
                        <p className="text-blue-100 text-center mt-1">Sign in to your account</p>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleLogin} className="space-y-6">
                            {/* Email/Phone Field */}
                            <div>
                                <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email or Phone Number
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="user"
                                        id="user"
                                        onChange={handleChange}
                                        value={values.user}
                                        onBlur={handleBlur}
                                        className={`w-full px-4 py-3 rounded-lg border ${errors.user && touched.user ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                                        placeholder="Enter email or phone number"
                                    />
                                    {errors.user && touched.user && (
                                        <p className="mt-1 text-sm text-red-600">{errors.user}</p>
                                    )}
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        id="password"
                                        onChange={handleChange}
                                        value={values.password}
                                        onBlur={handleBlur}
                                        className={`w-full px-4 py-3 rounded-lg border ${errors.password && touched.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                                        placeholder="Enter password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && touched.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="isRememberMe"
                                        name="isRememberMe"
                                        type="checkbox"
                                        checked={values.isRememberMe}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="isRememberMe" className="ml-2 block text-sm text-gray-700">
                                        Remember me
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <Link to="/forgotpassword" className="font-medium text-blue-600 hover:text-blue-500">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                                >
                                    <LoadingButton loading={loading} title="Sign In" />
                                </button>
                            </div>

                            {error && (
                                <div className="text-center text-sm text-red-600">
                                    {error}
                                </div>
                            )}
                        </form>

                        {/* Divider */}
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>
                        </div>

                        {/* Google Login */}
                        <div className="mt-6 flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => toast.error("Google login failed")}
                                shape="pill"
                                theme="filled_blue"
                                size="large"
                                text="signin_with"
                            />
                        </div>

                        {/* Sign Up Link */}
                        <div className="mt-6 text-center text-sm">
                            <span className="text-gray-600">Not a member? </span>
                            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                                Register now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Login;
