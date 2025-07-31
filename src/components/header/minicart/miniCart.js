import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeItem } from '../../../store/cartSlice';
import './MiniCart.css';

const MiniCart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [miniCart, setMiniCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);

  useEffect(() => {
    setMiniCart(cart.cart || []);
    const totalAmount = cart?.cart?.reduce((acc, curr) => acc + curr.price * curr.qty, 0);
    const totalShippingCost = cart?.cart?.reduce((acc, curr) => acc + curr.shippingCost * curr.qty, 0);
    setTotal(totalAmount);
    setShippingCost(totalShippingCost);
  }, [cart.cart]);

  const RemoveItem = (id) => {
    dispatch(removeItem(id));
  };

  return (
    <div className="minicart-container">
      <div className="dropdown">
        <div
          className="cart-button d-flex align-items-center justify-content-end"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <div className="cart-icon d-flex align-items-center">
            <i className="bi bi-basket basket-icon"></i>
            <span className="cart-badge">{miniCart.length}</span>
          </div>
          <div className="cart-summary ms-2 text-end">
            <div className="summary-title">My Cart</div>
            <div className="summary-price">Rs. {total}</div>
          </div>
        </div>

        <ul className="dropdown-menu dropdown-menu-end minicart-dropdown">
          {miniCart.length > 0 ? (
            <>
              <li>
                <table className="table table-striped minicart-table">
                  <tbody>
                    {miniCart.map((p, i) => (
                      <tr key={i} className="fade-in">
                        <td className="text-center">
                          <Link to={`/parts/${p.id}`}>
                            <img src={p.photo} alt={p.name} width="45" height="45" />
                          </Link>
                        </td>
                        <td className="text-start">
                          <small>{p.name}</small>
                        </td>
                        <td className="text-center">x{p.qty}</td>
                        <td className="text-end">Rs.{p.price * p.qty}</td>
                        <td className="text-end">
                          <button className="btn btn-sm text-danger" onClick={() => RemoveItem(p.id)}>
                            &times;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </li>
              <li>
                <table className="table table-bordered mb-0">
                  <tbody>
                    <tr>
                      <td>Sub-Total</td>
                      <td className="text-end">Rs.{total}</td>
                    </tr>
                    <tr>
                      <td>Shipping</td>
                      <td className="text-end">Rs.{shippingCost}</td>
                    </tr>
                    <tr>
                      <td><strong>Total</strong></td>
                      <td className="text-end"><strong>Rs.{total + shippingCost}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </li>
              <li className="text-end p-2">
                <Link className="btn btn-outline-primary btn-sm me-2" to="/cart">
                  <i className="bi bi-cart"></i> View Cart
                </Link>
                <Link className="btn btn-primary btn-sm" to="/checkout">
                  <i className="bi bi-box-arrow-right"></i> Checkout
                </Link>
              </li>
            </>
          ) : (
            <li className="p-3 text-center">Your cart is empty.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MiniCart;
