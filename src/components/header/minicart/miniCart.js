import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromCart } from '../../store/cartSlice';
import './miniCart.css';

const MiniCart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className="mini-cart-container d-flex justify-content-end align-items-center">
      <div className="cart-icon-container position-relative me-2">
        <i className="bi bi-bag" style={{ fontSize: '1.8rem' }}></i>
        {totalQuantity > 0 && (
          <span className="cart-badge position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
            {totalQuantity}
          </span>
        )}
      </div>

      <div className="cart-summary text-end">
        <div className="cart-label text-muted small">Your Cart</div>
        <div className="cart-total fw-bold">£{totalPrice}</div>
      </div>

      {/* Optional dropdown content or side cart */}
      {cartItems.length > 0 && (
        <div className="cart-dropdown bg-white shadow p-3 mt-3">
          {cartItems.map((item) => (
            <div key={item.id} className="d-flex align-items-center justify-content-between mb-2">
              <div>
                <div className="fw-semibold">{item.name}</div>
                <div className="small text-muted">{item.quantity} × £{item.price.toFixed(2)}</div>
              </div>
              <i
                className="bi bi-trash text-danger pointer"
                title="Remove"
                onClick={() => handleRemove(item.id)}
              ></i>
            </div>
          ))}

          <div className="d-grid gap-2 mt-3">
            <Link to="/cart" className="btn btn-outline-dark btn-sm">
              <i className="bi bi-eye me-1"></i> View Cart
            </Link>
            <Link to="/checkout" className="btn btn-dark btn-sm">
              <i className="bi bi-credit-card me-1"></i> Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniCart;
