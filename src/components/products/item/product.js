import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../store/cartSlice";
import toast from 'react-hot-toast';
import {useScrollAnimation} from "./srollAnimation"; // ✅ Correct path here
const Product = (props) => {
	useScrollAnimation();
	const dispatch = useDispatch();
	
	const getAddToCart = (product) => {
		//console.log(product);
		let p = {};	
		p = {
			id: product?._id,
			name: product?.name,
			urduName: product?.urduName,
			photo: product?.photo,
			category: p?.category,
			totalReviews: product?.totalReviews,
			totalStars: product?.totalStars,
			manufacturer: product?.manufacturer,
			price: product?.s_price,
			shippingCost: product?.shippingCost||0,
			
			profit:Number(product.s_price)-Number(product.p_price)
		};
		//console.log(p);
		dispatch(addToCart(p));
		window.scroll(0, 0);
		toast.success(product.name+" successfully added to cart.");

	}

    return (<>
		<div className="col-12 col-sm-6 col-lg-3 text-center mt-3">
			<div className="card scroll-animate visible" >
				<Link to={`/parts/${props._id}`}>		
	<img src={`${ props.photo}`} className="card-img-top" alt={`${props.name}`} height="220" />
	</Link>
				{props.latestProducts === true ? (<><span className="new-product-label">New</span></>):(<></>)}
				{props.discount > 0 ? (<><span className="sale-label">-11%</span></>) : (<></>)}
				<div className="card-body">
					<div className="p-1">
						{[...Array(5)].map((_, i) => {
							return <span key={i} className={`${i < (Number(props.totalStars)/Number(props.totalReviews)) ? "selected" : ""}`} style={{ "fontSize": "18px" }} >&#9733;</span>
						})}
						<span> {props.totalReviews} {props.totalReviews > 1 ?" Reviews":"Review"}</span>
					</div>
					<h5 className="card-title"><Link to={`/parts/${props._id}`}>{props.name} <br />{props.urduName}</Link></h5>
					<p className="card-text">
						{ props.manufacturer} Company&#39; {props.name} with {props.quality} quality for {props.category}.
					</p>
					<h3>
						{props.discount > 0 ? (<><span style={{ "fontSize": "16px" }} className="text-danger"><del>Rs.{props.s_price + 10}</del>  </span></>) : (<></>)}
						Rs.{props.s_price}					</h3>
					<button className={`btn addTocart-btn ${ Number(props.quantity)<1?"disabled text-danger":"enabled"}`}  onClick={() => getAddToCart(props)}>{Number(props.quantity) < 1 ? "Out Of Stock" :"Add to Basket"}</button>
				</div>
			</div>

		</div>

    </>)
}
export default Product;
