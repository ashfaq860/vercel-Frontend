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

    useEffect(() => {
        setMiniCart(cart.cart);

        const totalAmount = cart.cart.reduce((acc, curr) => acc + curr.price * curr.qty, 0);
        const totalShipping = cart.cart.reduce((acc, curr) => acc + curr.shippingCost * curr.qty, 0);

        setTotal(totalAmount);
        setShippingCost(totalShipping);
    }, [cart.cart]);

    const RemoveItem = (id) => {
        dispatch(removeItem(id));
    };

    return (
        <div className="shoping-cart min-shopping-cart" style={{ width: "275px" }}>
            <div className="btn-shoppingCart">
                <div className="dropdown">
                    <div
                        className="btn dropdown-toggle1 d-flex justify-content-end align-items-center gap-3"
                        id="dropdownMenuButton1"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        role="button"
                    >
                        {/* Cart Icon & Badge */}
                        <div className="d-flex align-items-center gap-2">
                            <span className="bskt-icon position-relative">
                                <i className="bi bi-basket fs-4"></i>
                                <span className="bskt-qty position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {miniCart.length < 10 ? "0" : ""}
                                    {miniCart.length}
                                </span>
                            </span>
                        </div>

                        {/* Cart Text & Total */}
                        <div className="basket-txt text-end">
                            <span className="d-block fw-bold">My Cart</span>
                            <span className="d-block text-muted">Rs. {total}</span>
                        </div>
                    </div>

                    {/* Dropdown Content */}
                    {miniCart?.length > 0 ? (
                        <ul className="dropdown-menu p-3" aria-labelledby="dropdownMenuButton1">
                            <li>
                                <table className="table table-sm table-borderless mb-2">
                                    <tbody>
                                        {miniCart.map((p, i) => (
                                            <tr key={i}>
                                                <td className="text-center">
                                                    <Link to={`/parts/${p.id}`}>
                                                        <img
                                                            src={p.photo}
                                                            alt={p.name}
                                                            title={p.name}
                                                            className="img-fluid"
                                                            width="45"
                                                            height="45"
                                                        />
                                                    </Link>
                                                </td>
                                                <td className="text-start">
                                                    <small>{p.name}</small>
                                                    <div>x{p.qty}</div>
                                                </td>
                                                <td className="text-end">Rs.{p.price * p.qty}</td>
                                                <td className="text-end">
                                                    <button
                                                        className="btn btn-sm text-danger p-0"
                                                        onClick={() => RemoveItem(p.id)}
                                                    >
                                                        ×
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </li>
                            <li>
                                <table className="table table-sm table-bordered mb-2">
                                    <tbody>
                                        <tr>
                                            <td><strong>Sub-Total</strong></td>
                                            <td className="text-end">Rs.{total}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Shipping</strong></td>
                                            <td className="text-end">Rs.{shippingCost}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Total</strong></td>
                                            <td className="text-end">Rs.{total + shippingCost}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </li>
                            <li className="text-end">
                                <Link to="/cart" className="btn btn-outline-secondary btn-sm me-2">
                                    <i className="bi bi-cart-check"></i> View Cart
                                </Link>
                                <Link to="/checkout" className="btn btn-primary btn-sm">
                                    <i className="bi bi-credit-card"></i> Checkout
                                </Link>
                            </li>
                        </ul>
                    ) : (
                        <ul className="dropdown-menu p-3" aria-labelledby="dropdownMenuButton1">
                            <li className="text-center text-muted">Cart is empty</li>
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MiniCart;
