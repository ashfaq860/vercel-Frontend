import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeItem } from '../../../store/cartSlice';

const MiniCart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [miniCart, setMiniCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMiniCart(cart.cart);
    const totalAmount = cart.cart.reduce(
      (acc, curr) => acc + Number(curr.price) * Number(curr.qty),
      0
    );
    const totalShipping = cart.cart.reduce(
      (acc, curr) => acc + Number(curr.shippingCost) * Number(curr.qty),
      0
    );
    setTotal(totalAmount);
    setShippingCost(totalShipping);
  }, [cart.cart]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        dropdownRef.current.classList.remove('show');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    dropdownRef.current.classList.toggle('show');
  };

  const RemoveItem = (id) => {
    dispatch(removeItem(id));
  };

  return (
    <>
      <div className="position-relative" ref={dropdownRef}>
        <div className="basket-icon" onClick={toggleDropdown}>
          <i className="bi bi-basket2-fill fs-4 text-dark"></i>
          {miniCart.length > 0 && (
            <span className="cart-badge">{miniCart.length}</span>
          )}
        </div>

        <div className="cart-dropdown shadow-sm p-3">
          {miniCart.length > 0 ? (
            <>
              <div className="cart-items overflow-auto">
                {miniCart.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex align-items-center justify-content-between border-bottom py-2"
                  >
                    <div className="d-flex gap-2 align-items-center">
                      <img
                        src={item.photo}
                        alt={item.name}
                        width="45"
                        height="45"
                        className="rounded border"
                      />
                      <div>
                        <Link
                          to={`/parts/${item.id}`}
                          className="text-decoration-none text-dark"
                        >
                          <strong>{item.name}</strong>
                        </Link>
                        <div className="text-muted small">Qty: {item.qty}</div>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold">Rs.{item.price * item.qty}</div>
                      <span
                        className="text-danger delete-btn"
                        onClick={() => RemoveItem(item.id)}
                        title="Remove Item"
                      >
                        <i className="bi bi-trash-fill fs-6"></i>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 border-top pt-3">
                <div className="d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <strong>Rs.{total}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Shipping:</span>
                  <strong>Rs.{shippingCost}</strong>
                </div>
                <div className="d-flex justify-content-between border-top pt-2 mt-2">
                  <span>Total:</span>
                  <strong>Rs.{total + shippingCost}</strong>
                </div>
              </div>

              <div className="mt-3 d-flex justify-content-between gap-2">
                <Link to="/cart" className="btn btn-outline-dark btn-sm w-50">
                  View Cart
                </Link>
                <Link to="/checkout" className="btn btn-dark btn-sm w-50">
                  Checkout
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center text-muted small py-2">Your cart is empty.</div>
          )}
        </div>
      </div>

      <style jsx="true">{`
        .basket-icon {
          position: relative;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .basket-icon:hover {
          transform: scale(1.1);
        }

        .cart-badge {
          position: absolute;
          top: -6px;
          right: -8px;
          background: #dc3545;
          color: #fff;
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 50%;
          font-weight: bold;
        }

        .cart-dropdown {
          position: absolute;
          top: 120%;
          right: 0;
          width: 320px;
          background: #fff;
          border-radius: 0.75rem;
          display: none;
          z-index: 999;
          border: 1px solid #eee;
          max-height: 400px;
          animation: fadeIn 0.2s ease-in-out;
        }

        .cart-dropdown.show {
          display: block;
        }

        .cart-items {
          max-height: 230px;
          overflow-y: auto;
        }

        .delete-btn {
          cursor: pointer;
          opacity: 0.7;
        }

        .delete-btn:hover {
          color: #dc3545;
          opacity: 1;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default MiniCart;
