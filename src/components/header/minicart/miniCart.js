import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeItem } from '../../../store/cartSlice';

const MiniCart = () => {
  const cart = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();
  const [total, setTotal] = useState(0);
  const [shipping, setShipping] = useState(0);

  useEffect(() => {
    let totalAmount = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    let shippingCost = cart.reduce((acc, item) => acc + (item.shippingCost || 0) * item.qty, 0);
    setTotal(totalAmount);
    setShipping(shippingCost);
  }, [cart]);

  const handleRemove = (id) => {
    dispatch(removeItem(id));
  };

  return (
    <div className="mini-cart-wrapper">
      <div className="mini-cart-button d-flex justify-content-end align-items-center">
        <div className="cart-icon d-flex align-items-center" data-bs-toggle="dropdown" role="button">
          <div className="icon position-relative me-2">
            <i className="bi bi-cart4 fs-4 text-dark"></i>
            {cart.length > 0 && (
              <span className="cart-badge">{cart.length}</span>
            )}
          </div>
          <div className="cart-summary text-end">
            <div className="small text-muted">My Cart</div>
            <div className="fw-bold">Rs. {total}</div>
          </div>
        </div>

        <ul className="dropdown-menu dropdown-menu-end cart-dropdown p-3">
          {cart.length === 0 ? (
            <li className="text-center text-muted">Cart is empty</li>
          ) : (
            <>
              <li>
                {cart.map((item, index) => (
                  <div key={item.id || index} className="cart-item d-flex align-items-center justify-content-between fade-in">
                    <Link to={`/parts/${item.id}`} className="d-flex align-items-center text-decoration-none text-dark flex-grow-1">
                      <img
                        src={item.photo}
                        alt={item.name}
                        className="cart-item-img me-2"
                      />
                      <div className="cart-item-details">
                        <div className="cart-item-name">{item.name}</div>
                        <div className="text-muted small">x{item.qty} - Rs. {item.price * item.qty}</div>
                      </div>
                    </Link>
                    <button className="btn btn-sm text-danger ms-2" onClick={() => handleRemove(item.id)}>
                      <i className="bi bi-trash3-fill"></i>
                    </button>
                  </div>
                ))}
              </li>

              <li className="mt-3">
                <table className="table table-sm mb-2">
                  <tbody>
                    <tr>
                      <td className="text-start">Sub-Total</td>
                      <td className="text-end">Rs. {total}</td>
                    </tr>
                    <tr>
                      <td className="text-start">Shipping</td>
                      <td className="text-end">Rs. {shipping}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-start">Total</td>
                      <td className="fw-bold text-end">Rs. {total + shipping}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="d-flex justify-content-between gap-2">
                  <Link to="/cart" className="btn btn-outline-dark w-50">
                    <i className="bi bi-eye me-1"></i> View Cart
                  </Link>
                  <Link to="/checkout" className="btn btn-dark w-50">
                    <i className="bi bi-box-arrow-right me-1"></i> Checkout
                  </Link>
                </div>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MiniCart;
