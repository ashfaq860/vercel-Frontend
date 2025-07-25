//import './product.css';
import { Link,useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CategoryRelatedProduct } from "../api/internal";
import Layout from "../components/layout/layout";
import FeaturedProducts from "../components/products/featuredProduct";
import CategoryProducts from "../components/products/categoryProducts";
import { Helmet } from 'react-helmet-async';

const CategoryWiseProducts = () => {
	const [products, setProducts] = useState([]);
	const { cId,name } = useParams();

	return (<>
		<Layout>
			<Helmet>
				
				<title>{`${name} Parts`}-Mian Motorcycle Parts Shop Raiwind</title>
				<meta name="description" content={` ${name} Parts- Mian Motocycle Parts, Honda 70 , CG125, China 70, Uniter 100, Ching CHi Rickshaw, Location Kasur Road Raiwind`} />
			</Helmet>
			<div className="container">
				<CategoryProducts cId={cId} name={name } />
				<FeaturedProducts />
</div>


		</Layout>
		

	</>);
}
export default CategoryWiseProducts;