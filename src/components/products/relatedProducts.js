import './product.css';
import { relatedProducts } from '../../api/internal';
import { useState,useEffect } from 'react';
import Product from './item/product';
import './product.css';
import Loader from '../../pages/loader/loader';
const RelatedProducts = (props) => {
const [products, setProducts] = useState([]);
const getProductsOfSelectedCategory = async () => {
		const res	=	await relatedProducts(props.cId);
		//const res = await CategoryRelatedProduct(cId);
		if(res.status===200)
		setProducts(res.data.products);
	   //console.log(products);
}
useEffect(() => {
		getProductsOfSelectedCategory();
}, [props.cId]);

	return (<>

		<div className="row">
			<div className="col-12 text-center mt-5">

				<div className="divider scrollShow">Related Products</div>
			</div>
		</div>

		<div className="row">
			{products.length === 0 ? (<> <Loader /> </>):(<></>) }
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
export default RelatedProducts;