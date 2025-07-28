import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../../../store/cartSlice";
import toast from 'react-hot-toast';
import useScrollAnimation from "../../../pages/srollAnimation";

const Product = (props) => {
  useScrollAnimation();
  const dispatch = useDispatch();

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
            src={`${process.env.REACT_APP_INTERNAL_API_PATH}/${props.photo}`} 
            className="card-img-top" 
            alt={props.name} 
            height="220" 
          />
        </Link>
        
        {props.latestProducts && <span className="new-product-label">New</span>}
        {props.discount > 0 && <span className="sale-label">-11%</span>}
        
        <div className="card-body">
          <div className="p-1">
            {[...Array(5)].map((_, i) => (
              <span 
                key={i} 
                className={i < (Number(props.totalStars)/Number(props.totalReviews)) ? "selected" : ""} 
                style={{ fontSize: "18px" }}
              >
                ★
              </span>
            ))}
            <span> {props.totalReviews} Review{props.totalReviews !== 1 ? 's' : ''}</span>
          </div>
          
          <h5 className="card-title">
            <Link to={`/parts/${props._id}`}>
              {props.name} <br />
              {props.urduName}
            </Link>
          </h5>
          
          <p className="card-text">
            {[props.manufacturer, "Company's", props.name, "with", props.quality, "quality for", props.category]
              .filter(Boolean).join(' ')}.
          </p>
          
          <h3>
            {props.discount > 0 && (
              <span style={{ fontSize: "16px" }} className="text-danger">
                <del>Rs.{props.s_price + 10}</del>
              </span>
            )}
            Rs.{props.s_price}
          </h3>
          
          <button 
            className={`btn addTocart-btn ${Number(props.quantity) < 1 ? "disabled text-danger" : "enabled"}`}
            onClick={() => getAddToCart(props)}
            disabled={Number(props.quantity) < 1}
          >
            {Number(props.quantity) < 1 ? "Out Of Stock" : "Add to Basket"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Product;
