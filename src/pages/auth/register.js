import Layout from "../../components/layout/layout";
import React from 'react';
import { Link } from "react-router-dom";
import { useState } from "react";
import signupSchema from "../schemas/signupSchema";
import { setUser } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import { register } from "../../api/internal";
import { useDispatch } from "react-redux";
import { toast } from 'react-hot-toast';
import LoadingButton from "../loader/loadingButton";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock } from "react-icons/fa";

const Register = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch(); 
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async () => {
        setLoading(true);
        const data = {
            name: values.name,
            email: values.email,
            password: values.password,
            phone: values.phone,
            address: values.address
        }
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
                auth: response.data.user.auth
            }
            dispatch(setUser(user));
            navigate('/admin/my-account');
        } 
        else if (response.status === 409) {
            setLoading(false);
            toast.error(response.response.data.message);
            setError(response.response.data.message);
        }
        else if (response.code === "ERR_BAD_REQUEST") {
            setError(response.response.data.message);
            console.log("Error occurred while registering: " + response.response.data.message);
        }
    }

    const { values, touched, handleBlur, handleChange, errors } = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            address: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: signupSchema
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
                                            <button type="button" className="btn-close" onClick={() => setError('')}></button>
                                        </div>
                                    )}

                                    <form>
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Full Name</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-white">
                                                    <FaUser className="text-muted" />
                                                </span>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.name}
                                                    className="form-control"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            {errors.name && touched.name && (
                                                <div className="text-danger small mt-1">{errors.name}</div>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label">Email Address</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-white">
                                                    <FaEnvelope className="text-muted" />
                                                </span>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    id="email"
                                                    value={values.email}
                                                    placeholder="example@example.com"
                                                />
                                            </div>
                                            {errors.email && touched.email && (
                                                <div className="text-danger small mt-1">{errors.email}</div>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="phone" className="form-label">Phone Number</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-white">
                                                    <FaPhone className="text-muted" />
                                                </span>
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    className="form-control"
                                                    id="phone"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.phone}
                                                    pattern="[0-9]+"
                                                    placeholder="03454447705"
                                                />
                                            </div>
                                            {errors.phone && touched.phone && (
                                                <div className="text-danger small mt-1">{errors.phone}</div>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="address" className="form-label">Address</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-white">
                                                    <FaMapMarkerAlt className="text-muted" />
                                                </span>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    className="form-control"
                                                    id="address"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.address}
                                                    placeholder="Your full address"
                                                />
                                            </div>
                                            {errors.address && touched.address && (
                                                <div className="text-danger small mt-1">{errors.address}</div>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label">Password</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-white">
                                                    <FaLock className="text-muted" />
                                                </span>
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
                                                    className="input-group-text bg-white"
                                                    onClick={togglePasswordVisibility}
                                                >
                                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                </button>
                                            </div>
                                            {errors.password && touched.password && (
                                                <div className="text-danger small mt-1">{errors.password}</div>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-white">
                                                    <FaLock className="text-muted" />
                                                </span>
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
                                            </div>
                                            {errors.confirmPassword && touched.confirmPassword && (
                                                <div className="text-danger small mt-1">{errors.confirmPassword}</div>
                                            )}
                                        </div>

                                        <div className="mb-4 form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="termsCheck"
                                                required
                                            />
                                            <label className="form-check-label small" htmlFor="termsCheck">
                                                I agree to the <Link to="/terms" className="text-decoration-none">Terms & Conditions</Link>
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
                                            <p className="small text-muted">Already have an account?{' '}
                                                <Link to="/login" className="text-decoration-none">Login here</Link>
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
}

export default Register;
