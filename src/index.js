import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle';
import "bootstrap-icons/font/bootstrap-icons.css";
import { HelmetProvider } from 'react-helmet-async';
import { GoogleOAuthProvider } from "@react-oauth/google";

// ✅ NProgress import and config
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// ✅ Global NProgress configuration
NProgress.configure({
    showSpinner: false,
    speed: 500,
    minimum: 0.2,
    trickleSpeed: 200
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <HelmetProvider>
                    <Toaster />
                    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                        <App />
                    </GoogleOAuthProvider>
                </HelmetProvider>
            </Provider>
        </BrowserRouter>
    </React.StrictMode>
);

reportWebVitals();
