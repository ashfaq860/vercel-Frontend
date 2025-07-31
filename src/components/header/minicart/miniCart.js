import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeItem } from '../../../store/cartSlice';
import './miniCart.css'; // Include the new fancy styles

const MiniCart = () => {
    const cart = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const [miniCart, setMiniCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [shippingCost, setShippingCost] = useState(0);

    useEffect(() => {
        setMiniCart(cart.cart);
        let totalAmount = cart?.cart?.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
        let totalShipping = cart?.cart?.reduce((acc, curr) => acc + (curr.shippingCost * curr.qty), 0);
        setTotal(totalAmount);
        setShippingCost(totalShipping);
    }, [cart.cart]);

    const RemoveItem = (id) => {
        dispatch(removeItem(id));
    };

    return (
        <div className="mini-cart-container d-flex justify-content-end align-items-center">
            <div className="cart-icon-wrapper dropdown">
                <div className="cart-trigger d-flex align-items-center" data-bs-toggle="dropdown">
                    <div className="cart-icon position-relative">
                        <i className="bi bi-basket2-fill fs-4"></i>
                        <span className="cart-badge">{miniCart.length}</span>
                    </div>
                    <div className="cart-summary ms-2 text-end">
                        <div className="cart-label">My Cart</div>
                        <div className="cart-total">Rs. {total}</div>
                    </div>
                </div>

                <ul className="dropdown-menu p-3 dropdown-menu-end mini-cart-dropdown">
                    {miniCart.length > 0 ? (
                        <>
                            <li>
                                <table className="table table-sm table-borderless mb-2">
                                    <tbody>
                                        {miniCart.map((p, i) => (
                                            <tr key={i} className="align-middle">
                                                <td width="20%">
                                                    <img src={p.photo} alt={p.name} width="45" height="45" className="rounded" />
                                                </td>
                                                <td>
                                                    <small>{p.name}</small>
                                                    <div className="text-muted small">x{p.qty} - Rs.{p.price * p.qty}</div>
                                                </td>
                                                <td className="text-end">
                                                    <button className="btn btn-sm text-danger p-0" onClick={() => RemoveItem(p.id)} title="Remove">
                                                        <i className="bi bi-x-circle-fill"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </li>
                            <li>
                                <div className="cart-totals mb-2">
                                    <div className="d-flex justify-content-between">
                                        <span>Sub-Total:</span>
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
                                <div className="d-flex gap-2 justify-content-end">
                                    <Link to="/cart" className="btn btn-outline-secondary btn-sm">
                                        <i className="bi bi-cart3 me-1"></i> View Cart
                                    </Link>
                                    <Link to="/checkout" className="btn btn-primary btn-sm">
                                        <i className="bi bi-box-arrow-right me-1"></i> Checkout
                                    </Link>
                                </div>
                            </li>
                        </>
                    ) : (
                        <li className="text-center text-muted">Cart is empty</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default MiniCart;
