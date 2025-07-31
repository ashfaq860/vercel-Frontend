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
        <>
            <Layout>
                <div
                    className="card removeBoxShadow mt-5 mb-5 col-lg-4 col-md-6 col-sm-10 col-12"
                    style={{ margin: "auto" }}>
                    <div className="card-body forms" style={{ margin: "auto" }}>
                        <h1 className="text-center">Login</h1>
                        <form onSubmit={handleLogin}>
                            <div className="row">
                                <div className="col-12 form-group">
                                    <input
                                        type="text"
                                        required
                                        name="user"
                                        onChange={handleChange}
                                        className="form-control"
                                        value={values.user}
                                        onBlur={handleBlur}
                                        id="email"
                                        placeholder="Enter email or Phone NO."
                                    />
                                    {errors.email && touched.email ? (
                                        <p className="text-danger">{errors.email}</p>
                                    ) : null}
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12 form-group confirmPass">
                                    <input
                                        type="password"
                                        required
                                        name="password"
                                        id="password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                        className="form-control"
                                        placeholder="Enter Password"
                                    />
                                   
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12 form-group">
                                    <input
                                        id="option1"
                                        type="checkbox"
                                        name="isRememberMe"
                                        checked={values.isRememberMe}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="option1"> &nbsp; Remember Me.</label> &nbsp;
                                    <Link to="/forgotpassword">&nbsp; Forgot password?</Link>
                                </div>
                            </div>

                            {error ? <p className="text-danger">{error}</p> : null}
<div>                            
                            <button type="submit" className="btn btn-primary btn-large">
                                    <div className="text-center"><LoadingButton loading={loading} title="Login Now" /></div>      
                            </button>
                            </div>
                        </form>
                    
                        <p className="textAfterButton mt-3 text-right">
                            Not a member?
                            <Link to="/register"> Register</Link>
                        </p>
                        <h5 className="text-center">OR</h5>
                        {/* Google Login Button */}
                        <div className="mt-3 d-flex justify-content-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => toast.error("Google login failed.")}
                            />
                        </div>

                        
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Login;
