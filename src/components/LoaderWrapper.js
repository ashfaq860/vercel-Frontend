// src/components/LoaderWrapper.js
import { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const LoaderWrapper = () => {
    useEffect(() => {
        NProgress.start();
        return () => {
            NProgress.done();
        };
    }, []);

    return null;
};

export default LoaderWrapper;
