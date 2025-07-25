import './product.css';
import { getLatestProducts } from "../../api/internal";
import { useEffect, useState } from "react";
import Product from "./item/product";
import Loader from '../../pages/loader/loader';
const NewProducts = () => {
	const [products, setProducts] = useState([]);
	const latestProducts = async () => {
		const res = await getLatestProducts(4);
		if(res.status==200)
			setProducts(res.data.products);
		console.log(res.data.products)
	}
	useEffect(() => {
		latestProducts();
	}, []);
	

	return (<>
			
				<div className="row">
			
					<div className="col-12 text-center mt-5">
				<div className="divider scrollShow">New Products</div>
			
				</div>
	
			</div>
		<div className="row">
			
			{products.length === 0 ? (<><Loader /></>) : (<></>)}
			{products.map((p, i) => (
				
				<Product
					key={i}
					_id={p._id}
					name={p.name}
					urduName={p.urduName}
					photo={p.photo}
					discount={0}
					s_price={p.s_price}
					p_price={p.p_price}
					model={p.model}
					quality={p.quality}
					quantity={p.quantity}
					shippingCost={p.shippingCost}
					category={p.category}
					manufacturer={p.manufacturer}
					latestProducts={p.isNew}
					totalReviews={p.totalReviews}
					totalStars={p.totalStars}
				/>


			))}
				
			</div>
		</>);
}
export default NewProducts;