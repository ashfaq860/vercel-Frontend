import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false });

const NProgressHandler = () => {
    const location = useLocation();

    useEffect(() => {
        NProgress.start();
        const timer = setTimeout(() => {
            NProgress.done();
        }, 300); // simulate load time for fast renders

        return () => clearTimeout(timer);
    }, [location.pathname]);

    return null;
};

export default NProgressHandler;
