import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeItem } from '../../../store/cartSlice';

const MiniCart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [miniCart, setMiniCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);

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

  const RemoveItem = (id) => {
    dispatch(removeItem(id));
  };

  return (
    <>
      <div className="mini-cart position-relative">
        <div
          className="cart-icon d-flex align-items-center"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          role="button"
        >
          <i className="bi bi-bag fs-4 text-dark"></i>
          {miniCart.length > 0 && (
            <span className="cart-badge">{miniCart.length}</span>
          )}
        </div>

        <div className="dropdown-menu p-3 shadow-sm border-0 mt-2 cart-dropdown">
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
                        <Link to={`/parts/${item.id}`} className="text-decoration-none text-dark">
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
                <Link to="/cart" className="btn btn-outline-secondary btn-sm w-50">
                  View Cart
                </Link>
                <Link to="/checkout" className="btn btn-primary btn-sm w-50">
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
        .mini-cart {
          cursor: pointer;
        }

        .cart-icon {
          position: relative;
          padding: 6px 10px;
          border-radius: 6px;
          transition: background-color 0.2s ease;
        }

        .cart-icon:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }

        .cart-badge {
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(50%, -50%);
          background-color: #dc3545;
          color: white;
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 50%;
        }

        .dropdown-menu.cart-dropdown {
          width: 320px;
          right: 0;
          left: auto;
          border-radius: 0.5rem;
          z-index: 999;
          animation: fadeIn 0.2s ease-in-out;
        }

        .cart-items {
          max-height: 250px;
        }

        .delete-btn {
          cursor: pointer;
          opacity: 0.7;
          transition: color 0.2s ease;
        }

        .delete-btn:hover {
          opacity: 1;
          color: #dc3545;
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
