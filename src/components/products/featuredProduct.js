import { getFeaturedProducts } from "../../api/internal";
import { useEffect, useState } from "react";
import Product from "./item/product";
import { Link } from "react-router-dom";
import Loader from "../../pages/loader/loader";
const FeaturedProducts = () => {
	
	const [products, setProducts] = useState([]);
	const selectedProducts = async () => {
		const res = await getFeaturedProducts();
		//console.log(res);
		if(res.status==200)
		setProducts(res.data.products);
		//console.log(products);
	}
	useEffect(() => {
		selectedProducts();
	}, []);
	
	return (<>
				<div className="row">
					<div className="col-12 text-center mt-5">
						<div className="divider">Featured Products</div>
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
					category={p.category}
					manufacturer={p.manufacturer}
					latestProducts={p.isNew}
				    totalReviews={p.totalReviews}
					totalStars={p.totalStars}
					shippingCost={p.shippingCost}
				/>
))}
			</div>
	
		</>);
}
export default FeaturedProducts;