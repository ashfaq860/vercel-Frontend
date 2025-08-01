import FeaturedProducts from "../components/products/featuredProduct";
import NewProducts from "../components/products/newProduct";
import PopularProducts from "../components/products/popularProducts";
import Slider from "../components/slider/slider";
import Layout from '../components/layout/layout';
import LatestCategories from "../components/products/latestCategories";
import { Helmet } from 'react-helmet-async';



const HomePage = () => {

    return (
        <>
            <Layout>
                <Helmet>
                   
                    <title>Mian Motorcycle Parts Raiwind- All kind of motocycle parts shop</title>
                    <meta name="description" content="Mian Motocycle Parts, Honda 70 , CG125, China 70, Uniter 100, Ching CHi Rickshaw, Location Kasur Road Raiwind"/>
                </Helmet>
            <Slider />
                <div className="container ">
                    
                        <LatestCategories />
                    <NewProducts />
                      <FeaturedProducts />
                    <PopularProducts />
               
                </div>
            </Layout>
        
    </>
    );
}
export default HomePage;
