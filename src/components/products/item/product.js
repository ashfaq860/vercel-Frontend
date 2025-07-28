import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../../../store/cartSlice";
import toast from 'react-hot-toast';
import useScrollAnimation from "../../../pages/srollAnimation";

const Product = (props) => {
  useScrollAnimation();
  const dispatch = useDispatch();

  // Safe image URL with fallback
  const getSafeImageUrl = () => {
    try {
      if (!props.photo) throw new Error('No photo available');
      const baseUrl = process.env.REACT_APP_INTERNAL_API_PATH || 'https://mianautoparts.up.railway.app';
      return `${baseUrl}/${props.photo.replace(/^\/+/, '')}`;
    } catch (error) {
      return 'https://via.placeholder.com/220x220?text=Product+Image';
    }
  };

  // Safe product description
  const getProductDescription = () => {
    try {
      const parts = [
        props.manufacturer,
        "Company's",
        props.name,
        "with",
        props.quality,
        "quality for",
        props.category
      ].filter(Boolean);
      
      return parts.length > 0 ? `${parts.join(' ')}.` : 'Product description not available';
    } catch (error) {
      return 'Product description not available';
    }
  };

  const handleAddToCart = () => {
    try {
      if (Number(props.quantity) < 1) {
        toast.error('This product is out of stock');
        return;
      }

      dispatch(addToCart({
        id: props._id,
        name: props.name,
        urduName: props.urduName,
        photo: props.photo,
        category: props.category,
        totalReviews: props.totalReviews || 0,
        totalStars: props.totalStars || 0,
        manufacturer: props.manufacturer,
        price: props.s_price,
        shippingCost: props.shippingCost || 0,
        profit: Number(props.s_price) - Number(props.p_price || 0)
      }));

      window.scrollTo(0, 0);
      toast.success(`${props.name || 'Product'} added to cart`);
    } catch (error) {
      toast.error('Failed to add product to cart');
      console.error('Add to cart error:', error);
    }
  };

  // Calculate star rating safely
  const renderStars = () => {
    try {
      const totalStars = Number(props.totalStars) || 0;
      const totalReviews = Number(props.totalReviews) || 1;
      const averageRating = totalStars / totalReviews;
      
      return [...Array(5)].map((_, i) => (
        <span 
          key={i} 
          className={i < averageRating ? "selected" : ""} 
          style={{ fontSize: "18px" }}
        >
          ★
        </span>
      ));
    } catch (error) {
      return null;
    }
  };

  return (
    <div className="col-12 col-sm-6 col-lg-3 text-center mt-3">
      <div className="card scroll-animate visible">
        <Link to={`/parts/${props._id}`}>
          <img 
            src={getSafeImageUrl()}
            className="card-img-top" 
            alt={props.name || 'Product'} 
            height="220"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/220x220?text=Image+Not+Found';
            }}
          />
        </Link>
        
        {props.latestProducts && <span className="new-product-label">New</span>}
        {props.discount > 0 && <span className="sale-label">-{props.discount}%</span>}
        
        <div className="card-body">
          <div className="p-1">
            {renderStars()}
            <span> {props.totalReviews || 0} Review{props.totalReviews !== 1 ? 's' : ''}</span>
          </div>
          
          <h5 className="card-title">
            <Link to={`/parts/${props._id}`}>
              {props.name || 'Product Name'} <br />
              {props.urduName || ''}
            </Link>
          </h5>
          
          <p className="card-text">
            {getProductDescription()}
          </p>
          
          <h3>
            {props.discount > 0 && (
              <span style={{ fontSize: "16px" }} className="text-danger">
                <del>Rs.{Number(props.s_price) + 10}</del>
              </span>
            )}
            Rs.{props.s_price || 'N/A'}
          </h3>
          
          <button 
            className={`btn addTocart-btn ${Number(props.quantity) < 1 ? "disabled text-danger" : "enabled"}`}
            onClick={handleAddToCart}
            disabled={Number(props.quantity) < 1}
          >
            {Number(props.quantity) < 1 ? "Out Of Stock" : "Add to Basket"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
