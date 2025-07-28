import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../../../store/cartSlice";
import toast from 'react-hot-toast';
import useScrollAnimation from "../../../pages/srollAnimation";

const Product = (props) => {
  useScrollAnimation();
  const dispatch = useDispatch();

  const getAddToCart = (product) => {
    const p = {
      id: product?._id,
      name: product?.name,
      urduName: product?.urduName,
      photo: product?.photo,
      category: product?.category,
      totalReviews: product?.totalReviews,
      totalStars: product?.totalStars,
      manufacturer: product?.manufacturer,
      price: product?.s_price,
      shippingCost: product?.shippingCost || 0,
      profit: Number(product.s_price) - Number(product.p_price)
    };
    
    dispatch(addToCart(p));
    window.scroll(0, 0);
    toast.success(`${product.name} successfully added to cart.`);
  }

  return (
   <></>
  )
}

export default Product;
