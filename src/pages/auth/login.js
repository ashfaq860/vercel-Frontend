import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginUser } from '../api/internal';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../store/userSlice';
import { useDispatch } from 'react-redux';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import toast from 'react-hot-toast';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [emailPhone, setEmailPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const login = async () => {
    try {
      const response = await loginUser({ emailPhone, password });
      if (response.status === 200) {
        const user = {
          _id: response.data.user._id,
          email: response.data.user.email,
          name: response.data.user.name,
        };
        dispatch(setUser(user));
        toast.success('Login successful');
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_REACT_APP_INTERNAL_API}/google-auth`,
          { access_token: response.access_token },
          { withCredentials: true }
        );

        if (res.status === 200) {
          const user = {
            _id: res.data.user._id,
            email: res.data.user.email,
            name: res.data.user.name,
          };
          dispatch(setUser(user));
          toast.success('Google login successful');
          navigate('/');
        }
      } catch (err) {
        toast.error('Google login failed');
      }
    },
  });

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow p-4" style={{ maxWidth: '420px', width: '100%' }}>
        <h3 className="text-center mb-4">Sign in to your account</h3>

        <div className="mb-3">
          <label htmlFor="emailPhone" className="form-label">Email or Phone Number</label>
          <input
            type="text"
            className="form-control"
            id="emailPhone"
            value={emailPhone}
            onChange={(e) => setEmailPhone(e.target.value)}
            placeholder="example@example.com"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
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
          <Link to="/forgot-password" className="text-decoration-none">Forgot password?</Link>
        </div>

        <button
          className="btn btn-primary w-100 mb-3"
          onClick={login}
          disabled={!emailPhone || !password}
        >
          Sign In
        </button>

        <div className="text-center mb-3">Or continue with</div>

        <button
          className="btn btn-outline-dark w-100 mb-4 d-flex align-items-center justify-content-center gap-2"
          onClick={() => loginWithGoogle()}
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            width="20"
            height="20"
          />
          Sign in with Google
        </button>

        <div className="text-center">
          Not a member? <Link to="/register">Register now</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
