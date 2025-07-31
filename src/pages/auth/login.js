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

// Ensure you import Bootstrap Icons somewhere in your app (e.g., in App.js or index.js):
// import 'bootstrap-icons/font/bootstrap-icons.css';

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
        photo: response.data.user.photo,
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

  const {
    values,
    touched,
    handleBlur,
    handleChange,
    errors,
    setFieldValue,
  } = useFormik({
    initialValues: {
      user: "",
      password: "",
      isRememberMe: false,
    },
    validationSchema: loginSchema,
  });

  const showPass = () => {
    setEye(!eye);
    const input = document.getElementById("password");
    input.type = input.type === "password" ? "text" : "password";
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
      <div className="d-flex align-items-center min-vh-100 bg-light">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-7 col-lg-6 col-xl-5">
              <div className="card shadow border-0 rounded-4">
                <div className="card-body p-4 p-sm-5">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold text-primary">Welcome Back</h2>
                    <p className="text-muted">Login to access your account</p>
                  </div>

                  <form onSubmit={handleLogin}>
                    {/* Email or Phone */}
                    <div className="mb-3 position-relative">
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                          <i className={`bi ${values.user.includes("@") ? "bi-envelope" : "bi-telephone"} text-muted`}></i>
                        </span>
                        <input
                          type="text"
                          name="user"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.user}
                          className="form-control border-start-0"
                          placeholder="Email or Phone Number"
                        />
                      </div>
                      {errors.user && touched.user && (
                        <div className="text-danger small mt-1">{errors.user}</div>
                      )}
                    </div>

                    {/* Password */}
                    <div className="mb-3 position-relative">
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                          <i className="bi bi-lock text-muted"></i>
                        </span>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.password}
                          className="form-control border-start-0 pe-5"
                          placeholder="Password"
                        />
                        <button
                          type="button"
                          onClick={showPass}
                          className="btn position-absolute top-0 end-0 bottom-0 d-flex align-items-center px-3 bg-transparent border-0"
                        >
                          <i className={`bi ${eye ? "bi-eye-slash" : "bi-eye"} text-muted`}></i>
                        </button>
                      </div>
                      {errors.password && touched.password && (
                        <div className="text-danger small mt-1">{errors.password}</div>
                      )}
                    </div>

                    {/* Remember Me & Forgot */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="rememberMe"
                          name="isRememberMe"
                          checked={values.isRememberMe}
                          onChange={handleChange}
                        />
                        <label className="form-check-label small" htmlFor="rememberMe">
                          Remember me
                        </label>
                      </div>
                      <Link to="/forgotpassword" className="small text-decoration-none">
                        Forgot password?
                      </Link>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary w-100 py-2 mb-3 shadow-sm"
                    >
                      <LoadingButton loading={loading} title="Sign In" />
                    </button>

                    {error && <div className="alert alert-danger small mb-3">{error}</div>}

                    {/* OR Divider */}
                    <div className="d-flex align-items-center my-4">
                      <hr className="flex-grow-1" />
                      <span className="px-3 text-muted small">OR</span>
                      <hr className="flex-grow-1" />
                    </div>

                    {/* Google Login */}
                    <div className="d-flex justify-content-center mb-3">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => toast.error("Google login failed.")}
                      />
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-center mt-4">
                      <p className="small text-muted mb-0">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-decoration-none fw-semibold">
                          Sign up
                        </Link>
                      </p>
                    </div>
                  </form>
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
