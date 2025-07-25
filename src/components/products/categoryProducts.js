
import './product.css';
import { Link,useParams } from "react-router-dom";
import { CategoryRelatedProduct } from '../../api/internal';
import { useState,useEffect } from 'react';

import Product from './item/product';
import Loader from '../../pages/loader/loader';
const CategoryProducts = (props) => {
	
	const [products, setProducts] = useState([]);
	//alert(props.cId);
	const getProductsOfSelectedCategory = async () => {
		const res	=	await CategoryRelatedProduct(props.cId);
		//const res = await CategoryRelatedProduct(cId);
		setProducts(res.data.products);
	}

	useEffect(() => {
		getProductsOfSelectedCategory();
	}, [props.cId])
	return (<>
		<div className="row">
			<div className="col-12 text-center mt-5">

				<div className="divider">{ props.name } Parts</div>
			</div>
		</div>

		<div className="row">
			{products.length === 0 ? (<><Loader /></>) : (<></>)}
			{products.length === 0 ? (<><p className="text-center"> No Parts Found! <Link to="/">Go Home</Link></p></>):(<></>) }
			{products.map((p, i) => (
					
				<Product
					key={p._id }
						_id={p._id}
						name={p.name}
						urduName={p.urduName}
						photo={p.photo}
						discount={0}
						s_price={p.s_price}
						p_price={p.p_price}
						model={p.model}
						quality={p.quality}
						quantity={p.quantity }
						category={p.category}
						manufacturer={p.manufacturer}
						latestProducts={p.isNew}
						totalReviews={p.totalReviews}
						totalStars={p.totalStars}
						shippingCost={p.shippingCost}
					/>
				
	
			)) }
		</div>

	</>);
}
export default CategoryProducts;