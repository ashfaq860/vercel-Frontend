import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeItem } from '../../../store/cartSlice';
import './miniCart.css';

const MiniCart = () => {
    const cart = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const [miniCart, setMiniCart] = useState([]);
    const [removingItems, setRemovingItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [shippingCost, setShippingCost] = useState(0);

    useEffect(() => {
        setMiniCart(cart.cart);

        let totalAmount = cart?.cart?.reduce((acc, curr) => Number(acc) + (Number(curr.price) * Number(curr.qty)), 0);
        let totalShippingCost = cart?.cart?.reduce((acc, curr) => Number(acc) + (Number(curr.shippingCost) * Number(curr.qty)), 0);

        setShippingCost(totalShippingCost);
        setTotal(totalAmount);
    }, [cart.cart]);

    const RemoveItem = (id) => {
        setRemovingItems((prev) => [...prev, id]);

        setTimeout(() => {
            dispatch(removeItem(id));
            setRemovingItems((prev) => prev.filter((itemId) => itemId !== id));
        }, 300); // matches fade-out duration
    };

    return (
        <div className="shoping-cart min-shopping-cart" style={{ width: '240px' }}>
            <div className="btn-shoppingCart">
                <div className="dropdown">
                    <div className="btn dropdown-toggle1 d-flex align-items-center justify-content-end" id="dropdownMenuButton1 cartButton" data-bs-toggle="dropdown" aria-expanded="false" role="button">
                        <div className="basket-icon position-relative me-2">
                            <span className="bskt-icon"><i className="bi bi-basket3 fs-4"></i></span>
                            <span className="bskt-qty badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">{miniCart.length}</span>
                        </div>
                        <div className="basket-txt text-end">
                            <span className="d-block">My Cart</span>
                            <span className="cart-Item-Price fw-bold text-primary">Rs.{total}</span>
                        </div>
                    </div>

                    <ul className="dropdown-menu p-2" aria-labelledby="dropdownMenuButton1">
                        {miniCart?.length > 0 ? (
                            <>
                                <li>
                                    <table className="table table-sm table-hover">
                                        <tbody>
                                            {miniCart.map((p, i) => (
                                                <tr
                                                    key={p._id || i}
                                                    className={`fade-in-cart-item ${removingItems.includes(p.id) ? 'fade-out-cart-item' : ''}`}
                                                >
                                                    <td className="text-center">
                                                        <Link to={`/parts/${p.id}`}>
                                                            <img src={p.photo} alt={p.name} title={p.name} className="img-fluid rounded" height="45" width="45" />
                                                        </Link>
                                                    </td>
                                                    <td className="text-start" colSpan="2">
                                                        <small>{p.name}</small><br />
                                                        <span className="text-muted small">x{p.qty}</span>
                                                    </td>
                                                    <td className="text-end">
                                                        Rs.{p.price * p.qty}
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-sm text-danger" onClick={() => RemoveItem(p.id)}>&times;</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </li>
                                <li>
                                    <table className="table table-bordered mb-2">
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
                                                <td className="text-end fw-bold">Rs.{Number(total) + Number(shippingCost)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="d-flex justify-content-between">
                                        <Link className="btn btn-outline-primary btn-sm" to="/cart">
                                            <i className="bi bi-cart-check-fill me-1"></i> View Cart
                                        </Link>
                                        <Link className="btn btn-primary btn-sm" to="/checkout">
                                            <i className="bi bi-credit-card-fill me-1"></i> Checkout
                                        </Link>
                                    </div>
                                </li>
                            </>
                        ) : (
                            <li className="text-center text-muted">Your cart is empty</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MiniCart;
