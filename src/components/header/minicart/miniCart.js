import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeItem } from '../../../store/cartSlice';
import './miniCart.css';

const MiniCart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [miniCart, setMiniCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [animateAdd, setAnimateAdd] = useState(false);
  const [fadeOutId, setFadeOutId] = useState(null);

  useEffect(() => {
    setMiniCart(cart.cart);
    const totalAmount = cart.cart.reduce((acc, curr) => acc + curr.price * curr.qty, 0);
    const totalShipping = cart.cart.reduce((acc, curr) => acc + curr.shippingCost * curr.qty, 0);
    setTotal(totalAmount);
    setShippingCost(totalShipping);

    // Trigger pop animation when cart updates
    if (cart.cart.length > 0) {
      setAnimateAdd(true);
      const timer = setTimeout(() => setAnimateAdd(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cart]);

  const handleRemove = (id) => {
    setFadeOutId(id);
    setTimeout(() => {
      dispatch(removeItem(id));
      setFadeOutId(null);
    }, 300); // Match fade-out animation
  };

  return (
    <div className="dropdown">
      <div
        className={`d-flex align-items-center justify-content-end cart-button-wrapper ${animateAdd ? 'pop' : ''}`}
        id="dropdownMenuButton1"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <div className="basket-icon d-flex align-items-center me-3 position-relative">
          <i className="bi bi-basket fs-4"></i>
          <span className="bskt-qty badge bg-danger position-absolute top-0 start-100 translate-middle">
            {miniCart.length < 10 ? '0' : ''}
            {miniCart.length}
          </span>
        </div>
        <div className="basket-txt d-flex flex-column text-end">
          <span className="text-muted small">My Cart</span>
          <span className="fw-bold">Rs. {total}</span>
        </div>
      </div>

      <ul className="dropdown-menu minicart-dropdown p-3 shadow" aria-labelledby="dropdownMenuButton1">
        {miniCart.length === 0 ? (
          <p className="text-center">Your cart is empty</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-borderless table-sm mb-2">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {miniCart.map((p) => (
                  <tr
                    key={p._id}
                    className={`fade-in-item ${fadeOutId === p._id ? 'fade-out' : ''}`}
                  >
                    <td>{p.name}</td>
                    <td>{p.qty}</td>
                    <td>Rs. {p.price}</td>
                    <td>
                      <span
                        className="text-danger pointer"
                        onClick={() => handleRemove(p._id)}
                        title="Remove"
                      >
                        <i className="bi bi-x-circle-fill fs-5"></i>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="cart-totals d-flex justify-content-between mb-2">
              <strong>Shipping:</strong>
              <span>Rs. {shippingCost}</span>
            </div>
            <div className="cart-totals d-flex justify-content-between mb-3">
              <strong>Total:</strong>
              <span>Rs. {total + shippingCost}</span>
            </div>
            <div className="d-flex justify-content-between">
              <Link to="/cart" className="btn btn-outline-primary btn-sm d-flex align-items-center">
                <i className="bi bi-eye me-1"></i> View Cart
              </Link>
              <Link to="/checkout" className="btn btn-primary btn-sm d-flex align-items-center">
                <i className="bi bi-box-arrow-right me-1"></i> Checkout
              </Link>
            </div>
          </div>
        )}
      </ul>
    </div>
  );
};

export default MiniCart;
