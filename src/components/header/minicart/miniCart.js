// src/components/MiniCart.js
import React from 'react';
import { Link } from 'react-router-dom';
import './miniCart.css';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../store/cartSlice';

const MiniCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart.items);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className="mini-cart-wrapper dropdown">
      <div
        className="cart-icon-wrapper dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <div className="icon-container">
          <i className="bi bi-bag"></i>
          <span className="cart-badge">{cart.length}</span>
        </div>
        <div className="cart-summary">
          <div className="cart-text">Your Cart</div>
          <div className="cart-price">Rs.{total.toFixed(2)}</div>
        </div>
      </div>

      <ul className="dropdown-menu mini-cart-dropdown p-3">
        {cart.length === 0 ? (
          <li className="text-muted small">Your cart is empty</li>
        ) : (
          <>
            {cart.map((item) => (
              <li key={item.id} className="mini-cart-item d-flex justify-content-between align-items-start mb-2">
                <div>
                  <div className="fw-semibold">{item.name}</div>
                  <div className="text-muted small">
                    {item.quantity} × Rs.{item.price}
                  </div>
                </div>
                <span
                  className="remove-item"
                  onClick={() => handleRemove(item.id)}
                  title="Remove item"
                >
                  <i className="bi bi-trash-fill"></i>
                </span>
              </li>
            ))}
            <li className="mt-2 text-end">
              <Link to="/cart" className="btn btn-sm btn-dark w-100">Go to Cart</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default MiniCart;
