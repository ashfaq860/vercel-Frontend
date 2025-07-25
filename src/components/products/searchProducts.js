
import './product.css';
import { Link,useParams } from "react-router-dom";
import { SearchRelatedProduct } from '../../api/internal';
import { useState,useEffect } from 'react';

import Product from './item/product';
const SearchedProducts = (props) => {
	
	const [products, setProducts] = useState([]);

	const getSearchedProducts = async () => {
		
		const res	=	await SearchRelatedProduct(props.term,props.cId);
		//const res = await CategoryRelatedProduct(cId);
		setProducts(res.data.products);
	}

	useEffect(() => {
		getSearchedProducts();
	}, [props.cId, props.term])
	return (<>
		<div className="row">
			<div className="col-12 text-center mt-5">

				<div className="divider text-capitalize scrollShow">{ props.term } searched Parts</div>
			</div>
		</div>

		<div className="row scrollShow">
			{products.length === 0 ? (<><p className="text-center"> No Parts Found! <Link to="/">Go Home</Link></p></>):(<></>) }
			{products.map((p, i) => (
				<>			
				<Product
						_id={p._id}
						name={p.name}
						urduName={p.urduName}
						photo={p.photo}
						discount={0}
						s_price={p.s_price}
						p_price={p.p_price}
						model={p.model}
						quality={p.quality}
						category={p.category}
						manufacturer={p.manufacturer}
						latestProducts={p.isNew}
						totalReviews={p.totalReviews}
						totalStars={p.totalStars}
						shippingCost={p.shippingCost}
					/>
			
				</>
	
			)) }
		</div>

	</>);
}
export default SearchedProducts;