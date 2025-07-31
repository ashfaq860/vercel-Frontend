import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../api/internal';
import { setUser } from '../../store/userSlice';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [emailPhone, setEmailPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!emailPhone.trim()) errs.emailPhone = 'Email or phone is required';
    if (!password.trim()) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const login = async () => {
    if (!validate()) return;

    try {
    const data  =  {
      emailPhone,password
    }
      const response = await loginUser(data);

      if (response.status === 200) {
        const user = {
          _id: response.data.user._id,
          email: response.data.user.email,
          name: response.data.user.name,
        };
        dispatch(setUser(user));
        toast.success('Welcome back!');
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_INTERNAL_API}/google-auth`,
          { access_token: tokenResponse.access_token },
          { withCredentials: true }
        );

        if (response.status === 200) {
          const user = {
            _id: response.data.user._id,
            email: response.data.user.email,
            name: response.data.user.name,
          };
          dispatch(setUser(user));
          toast.success('Logged in with Google!');
          navigate('/');
        }
      } catch {
        toast.error('Google login failed');
      }
    },
  });

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light px-3">
      <div className="login-card bg-white rounded shadow-lg p-4 p-md-5 animate-fadein">
        <h3 className="text-center mb-4 fw-bold">Welcome Back 👋</h3>

        <div className="mb-3">
          <label htmlFor="emailPhone" className="form-label">Email or Phone</label>
          <input
            type="text"
            className={`form-control ${errors.emailPhone ? 'is-invalid' : ''}`}
            id="emailPhone"
            placeholder="you@example.com"
            value={emailPhone}
            onChange={(e) => {
              setEmailPhone(e.target.value);
              setErrors({ ...errors, emailPhone: '' });
            }}
          />
          <div className="invalid-feedback">{errors.emailPhone}</div>
        </div>

        <div className="mb-3 position-relative">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors({ ...errors, password: '' });
            }}
          />
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary position-absolute end-0 top-50 translate-middle-y me-2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
          <div className="invalid-feedback">{errors.password}</div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
          </div>
          <Link to="/forgot-password" className="small text-decoration-none">Forgot password?</Link>
        </div>

        <button
          onClick={login}
          className="btn btn-primary w-100 mb-3 fw-semibold"
        >
          Sign In
        </button>

        <div className="text-center text-muted mb-3">or</div>

        <button
          className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-2 mb-4"
          onClick={() => loginWithGoogle()}
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
            width="20"
            height="20"
          />
          Sign in with Google
        </button>

        <div className="text-center">
          Don’t have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>

      <style jsx="true">{`
        .login-card {
          max-width: 420px;
          width: 100%;
        }
        .form-control::placeholder {
          color: #aaa;
        }
        .animate-fadein {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Login;
