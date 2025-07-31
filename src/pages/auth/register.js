import Layout from "../../components/layout/layout";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import signupSchema from "../schemas/signupSchema";
import { setUser } from "../../store/userSlice";
import { register } from "../../api/internal";
import { toast } from "react-hot-toast";
import LoadingButton from "../loader/loadingButton";

const Register = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async () => {
    setLoading(true);
    const data = {
      name: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone,
      address: values.address,
    };
    const response = await register(data);
    setLoading(false);

    if (response.status === 201) {
      toast.success("Registered Successfully!");
      const user = {
        _id: response.data.user._id,
        email: response.data.user.email,
        username: response.data.user.name,
        phone: response.data.user.phone,
        address: response.data.user.address,
        auth: response.data.user.auth,
      };
      dispatch(setUser(user));
      navigate("/admin/my-account");
    } else if (response.status === 409) {
      toast.error(response.response.data.message);
      setError(response.response.data.message);
    } else if (response.code === "ERR_BAD_REQUEST") {
      setError(response.response.data.message);
    }
  };

  const { values, touched, handleBlur, handleChange, errors } = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: signupSchema,
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Layout>
      <div className="d-flex align-items-center min-vh-100 bg-light">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6 col-xl-5">
              <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                <div className="card-body p-4 p-sm-5">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold text-primary">Create Account</h2>
                    <p className="text-muted">Get started with your free account</p>
                  </div>

                  {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                      {error}
                      <button type="button" className="btn-close" onClick={() => setError("")}></button>
                    </div>
                  )}

                  <form>
                    {[
                      { label: "Full Name", name: "name", type: "text", placeholder: "John Doe" },
                      { label: "Email Address", name: "email", type: "email", placeholder: "example@example.com" },
                      { label: "Phone Number", name: "phone", type: "text", placeholder: "03454447705" },
                      { label: "Address", name: "address", type: "text", placeholder: "Your full address" },
                    ].map((field) => (
                      <div className="mb-3" key={field.name}>
                        <label htmlFor={field.name} className="form-label">{field.label}</label>
                        <input
                          type={field.type}
                          name={field.name}
                          id={field.name}
                          className="form-control"
                          placeholder={field.placeholder}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values[field.name]}
                        />
                        {errors[field.name] && touched[field.name] && (
                          <div className="text-danger small mt-1">{errors[field.name]}</div>
                        )}
                      </div>
                    ))}

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          className="form-control"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.password}
                          placeholder="Create password"
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                      {errors.password && touched.password && (
                        <div className="text-danger small mt-1">{errors.password}</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        className="form-control"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.confirmPassword}
                        placeholder="Confirm password"
                      />
                      {errors.confirmPassword && touched.confirmPassword && (
                        <div className="text-danger small mt-1">{errors.confirmPassword}</div>
                      )}
                    </div>

                    <div className="mb-4 form-check">
                      <input type="checkbox" className="form-check-input" id="termsCheck" required />
                      <label className="form-check-label small" htmlFor="termsCheck">
                        I agree to the <Link to="/terms">Terms & Conditions</Link>
                      </label>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary w-100 py-2 mb-3"
                      onClick={handleRegister}
                      disabled={loading}
                    >
                      <LoadingButton loading={loading} title="Register Now" />
                    </button>

                    <div className="text-center">
                      <p className="small text-muted">
                        Already have an account? <Link to="/login">Login here</Link>
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

export default Register;
