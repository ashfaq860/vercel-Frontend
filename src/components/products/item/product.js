import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../../../store/cartSlice";
import toast from 'react-hot-toast';
import useScrollAnimation from "../../../pages/srollAnimation";

const Product = (props) => {
  useScrollAnimation();
  const dispatch = useDispatch();

  // Fallback image if photo is not available
  const getImageUrl = () => {
    try {
      if (!props.photo) throw new Error('No photo');
      return `${process.env.REACT_APP_INTERNAL_API_PATH}/${props.photo}`;
    } catch (error) {
      return 'https://via.placeholder.com/220';
    }
  };

  const getAddToCart = (product) => {
    dispatch(addToCart({
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
    }));
    window.scroll(0, 0);
    toast.success(`${product.name} added to cart`);
  }

  return (
    <div className="col-12 col-sm-6 col-lg-3 text-center mt-3">
      <div className="card scroll-animate visible">
        <Link to={`/parts/${props._id}`}>
          <img 
            src={getImageUrl()}
            className="card-img-top" 
            alt={props.name || 'Product image'} 
            height="220" 
          />
        </Link>
        
        {/* Rest of your component remains the same */}
        ...
      </div>
    </div>
  )
}

export default Product;
