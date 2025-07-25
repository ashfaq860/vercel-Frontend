import { Link } from "react-router-dom";
import Layout from "../components/layout/layout";
import { Helmet } from 'react-helmet-async';

const Error = () => {
    return (<>
        <Layout>
        <Helmet>
            <title>404 Page Not Found-Mian Motorcycle Parts Raiwind</title>
            <meta name="description" content="Mian Motocycle Parts, Honda 70 , CG125, China 70, Uniter 100, Ching CHi Rickshaw, Location Kasur Road Raiwind" />
            </Helmet>
            <div className="text-center mt-5 mb-t">
                <h1 >404 Page Not Found</h1>
                <p>Click to go to <Link to="/"> Home Page </Link></p>
            </div>
        </Layout>
    </>)
}
export default Error;