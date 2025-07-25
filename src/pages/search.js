//import './product.css';
import { Link,useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CategoryRelatedProduct } from "../api/internal";
import Layout from "../components/layout/layout";
import FeaturedProducts from "../components/products/featuredProduct";
import SearchProducts from "../components/products/searchProducts";
import { Helmet } from 'react-helmet-async';

const Search = () => {
	const [products, setProducts] = useState([]);
	const { cId,term } = useParams();
	
	return (<>
		<Layout>
		<Helmet>
			<meta charSet="utf-8" />
			<title>{`Search Result of ${term} `}-Mian Motorcycle Parts Shop Raiwind</title>
			<meta name="description" content={` Search Result for ${term}  Mian Motocycle Parts, Honda 70 , CG125, China 70, Uniter 100, Ching CHi Rickshaw, Location Kasur Road Raiwind`} />
		</Helmet>
			<div className="container">
			<SearchProducts cId={cId} term={ term } />
			
				<FeaturedProducts />
</div>


		</Layout>
		

	</>);
}
export default Search;