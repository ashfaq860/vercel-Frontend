import React, { useState, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../../../store/cartSlice';
import toast from 'react-hot-toast';
import useScrollAnimation from '../../../pages/srollAnimation';

const Product = React.memo((props) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dispatch = useDispatch();
  const scrollVisible = useScrollAnimation();

  // Memoized image URL calculation
  const imageUrl = useMemo(() => {
    if (!props.photo) return null;
    
    // Handle full URLs
    if (props.photo.startsWith('http')) {
      return props.photo;
    }
    
    // Handle relative paths
    const baseUrl = process.env.REACT_APP_INTERNAL_API_PATH || 'https://mianautoparts.up.railway.app';
    const cleanPath = props.photo.replace(/^\/+/, '');
    return `${baseUrl}/${cleanPath}`;
  }, [props.photo]);

  // Stable add to cart function
  const handleAddToCart = useCallback(() => {
    if (Number(props.quantity) < 1) {
      toast.error('This product is out of stock');
      return;
    }

    const productData = {
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
    };

    dispatch(addToCart(productData));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.success(`${props.name || 'Product'} added to cart`);
  }, [props, dispatch]);

  // Memoized product description
  const productDescription = useMemo(() => {
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
  }, [props.manufacturer, props.name, props.quality, props.category]);

  // Memoized star rating
  const starRating = useMemo(() => {
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
  }, [props.totalStars, props.totalReviews]);

  // Image load handlers
  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div className="col-12 col-sm-6 col-lg-3 text-center mt-3 product-item">
      <div className={`card ${scrollVisible ? 'visible' : 'hidden'}`}>
        <Link to={`/parts/${props._id}`} className="product-image-link">
          {imageError ? (
            <div className="image-placeholder">
              <span>No Image Available</span>
            </div>
          ) : (
            <img
              src={imageUrl || 'https://via.placeholder.com/220x220?text=Loading...'}
              className={`card-img-top ${imageLoaded ? 'loaded' : 'loading'}`}
              alt={props.name || 'Product'}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
          )}
        </Link>

        {props.latestProducts && <span className="new-product-label">New</span>}
        {props.discount > 0 && (
          <span className="sale-label">-{props.discount}%</span>
        )}

        <div className="card-body">
          <div className="rating-container">
            {starRating}
            <span className="review-count">
              {props.totalReviews || 0} Review{props.totalReviews !== 1 ? 's' : ''}
            </span>
          </div>

          <h5 className="card-title">
            <Link to={`/parts/${props._id}`}>
              {props.name || 'Product Name'}
              {props.urduName && <><br />{props.urduName}</>}
            </Link>
          </h5>

          <p className="card-text">{productDescription}</p>

          <div className="price-container">
            {props.discount > 0 && (
              <span className="original-price">
                <del>Rs.{Number(props.s_price) + 10}</del>
              </span>
            )}
            <span className="current-price">Rs.{props.s_price || 'N/A'}</span>
          </div>

          <button
            className={`add-to-cart-btn ${Number(props.quantity) < 1 ? 'out-of-stock' : ''}`}
            onClick={handleAddToCart}
            disabled={Number(props.quantity) < 1}
          >
            {Number(props.quantity) < 1 ? "Out Of Stock" : "Add to Basket"}
          </button>
        </div>
      </div>
    </div>
  );
});

export default Product;
