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
      <div className="position-relative mini-cart-container">
        <div
          className="btn btn-outline-primary d-flex align-items-center gap-2"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          style={{ minWidth: '160px' }}
        >
          <i className="bi bi-bag fs-5"></i>
          <span className="fw-semibold">Cart</span>
          <span className="badge bg-danger rounded-pill">{miniCart.length}</span>
        </div>

        <div className="dropdown-menu p-3 shadow-sm border-0 mt-2 cart-dropdown">
          {miniCart.length > 0 ? (
            <>
              <div className="cart-items max-vh-50 overflow-auto">
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
                      <button
                        className="btn btn-sm btn-link text-danger p-0 delete-btn"
                        onClick={() => RemoveItem(item.id)}
                        title="Remove Item"
                      >
                        <i className="bi bi-trash-fill fs-6"></i>
                      </button>
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
        .mini-cart-container .dropdown-menu {
          width: 300px;
          right: 0;
          left: auto;
          border-radius: 0.5rem;
          animation: fadeIn 0.2s ease-in-out;
          z-index: 999;
        }

        .delete-btn {
          opacity: 0.7;
          transition: all 0.2s ease;
        }

        .delete-btn:hover {
          opacity: 1;
          color: #dc3545;
        }

        .cart-items {
          max-height: 250px;
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
