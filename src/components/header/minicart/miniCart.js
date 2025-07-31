// src/components/MiniCart.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './miniCart.css';

const MiniCart = () => {
  const cart = useSelector((state) => state.cart.items);
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="mini-cart-wrapper dropdown">
      <div
        className="mini-cart-display d-flex align-items-center gap-2 dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <div className="cat-icon position-relative">
          <i className="bi bi-bag fs-4 text-dark"></i>
          <span className="cart-badge">{cart.length}</span>
        </div>

        <div className="cat-summery text-end">
          <div className="text-muted small">Your Cart</div>
          <div className="fw-bold">Rs.{total.toFixed(2)}</div>
        </div>
      </div>

      <ul className="dropdown-menu dropdown-menu-end p-3 mini-cart-dropdown">
        {cart.length === 0 ? (
          <li className="text-muted small">Your cart is empty</li>
        ) : (
          <>
            {cart.map((item) => (
              <li key={item.id} className="mb-2">
                <div className="fw-semibold">{item.name}</div>
                <div className="text-muted small">
                  {item.quantity} × Rs.{item.price}
                </div>
              </li>
            ))}
            <li className="mt-3 d-flex gap-2">
              <Link to="/cart" className="btn btn-outline-dark btn-sm w-50">
                <i className="bi bi-cart3 me-1"></i> View Cart
              </Link>
              <Link to="/checkout" className="btn btn-dark btn-sm w-50">
                <i className="bi bi-credit-card me-1"></i> Checkout
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default MiniCart;
