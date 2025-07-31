import { Link } from "react-router-dom";
import Layout from "../../components/layout/layout";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import loginSchema from "../schemas/loginSchema";
import { loginUser } from "../../api/internal";
import { setUser } from "../../store/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../loader/loadingButton";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

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

        const response = await loginUser(data);
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
            dispatch(setUser(user)); // Already contains all needed fields // Already contains all needed fields));
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

            // Call your backend
            const response = await login( googleData );

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
        }catch (error) {
            console.error(error);
            toast.error("An error occurred during Google login.");
        }
    };

    return (
    <Layout>
        <div className="container py-5">
            <div className="row justify-content-center align-items-center min-vh-100">
                <div className="col-12 col-sm-10 col-md-8 col-lg-5">
                    <div className="card shadow-lg border-0 rounded-4 p-4">
                        <div className="card-body">
                            <h2 className="text-center mb-4 fw-bold">Login to Your Account</h2>
                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email or Phone</label>
                                    <input
                                        type="text"
                                        required
                                        name="user"
                                        onChange={handleChange}
                                        className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                                        value={values.user}
                                        onBlur={handleBlur}
                                        id="email"
                                        placeholder="Enter email or phone number"
                                    />
                                    {errors.email && touched.email && (
                                        <div className="invalid-feedback">{errors.email}</div>
                                    )}
                                </div>

                                <div className="mb-3 position-relative">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        required
                                        name="password"
                                        id="password"
                                        onChange={(e) => {
                                            handleChange(e);
                                            Password(e.target.value);
                                        }}
                                        onBlur={handleBlur}
                                        value={values.password}
                                        className="form-control"
                                        placeholder="Enter password"
                                    />
                                    {show && (
                                        <button
                                            type="button"
                                            onClick={showPass}
                                            className="btn btn-sm btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2"
                                        >
                                            {eye ? "Hide" : "Show"}
                                        </button>
                                    )}
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="form-check">
                                        <input
                                            id="option1"
                                            type="checkbox"
                                            name="isRememberMe"
                                            checked={values.isRememberMe}
                                            onChange={handleChange}
                                            className="form-check-input"
                                        />
                                        <label htmlFor="option1" className="form-check-label">
                                            Remember Me
                                        </label>
                                    </div>
                                    <Link to="/forgotpassword" className="text-decoration-none small">
                                        Forgot password?
                                    </Link>
                                </div>

                                {error && <div className="text-danger mb-2">{error}</div>}

                                <button type="submit" className="btn btn-primary w-100 py-2">
                                    <LoadingButton loading={loading} title="Login Now" />
                                </button>
                            </form>

                            <div className="text-center mt-4">
                                <span className="text-muted">Not a member?</span>
                                <Link to="/register" className="ms-1 text-decoration-none">Register</Link>
                            </div>

                            <div className="text-center mt-4">
                                <span className="text-muted">OR</span>
                                <div className="d-flex justify-content-center mt-3">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => toast.error("Google login failed.")}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
);

};

export default Login;
