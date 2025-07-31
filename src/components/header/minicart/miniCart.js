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
        let totalAmount = cart?.cart?.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
        let totalShippingCost = cart?.cart?.reduce((acc, curr) => acc + (curr.shippingCost * curr.qty), 0);
        setShippingCost(totalShippingCost);
        setTotal(totalAmount);
    }, [cart.cart]);

    const RemoveItem = (id) => {
        dispatch(removeItem(id));
    };

    return (
        <div className="modern-minicart dropdown">
            <div className="cart-icon-wrapper dropdown-toggle" data-bs-toggle="dropdown">
                <div className="icon-container position-relative">
                    <i className="bi bi-bag" style={{ fontSize: '1.5rem' }}></i>
                    <span className="cart-badge">{miniCart.length}</span>
                </div>
                <div className="cart-summary">
                    <div className="text-muted small">Your Cart</div>
                    <div className="fw-bold">Rs.{total.toFixed(2)}</div>
                </div>
            </div>

            <ul className="dropdown-menu dropdown-menu-end p-3 shadow-lg minicart-dropdown">
                {miniCart.length > 0 ? (
                    <>
                        <div className="minicart-items">
                            {miniCart.map((item) => (
                                <div key={item.id} className="d-flex align-items-center mb-2">
                                    <img src={item.photo} alt={item.name} width="40" height="40" className="rounded me-2" />
                                    <div className="flex-grow-1">
                                        <small>{item.name}</small>
                                        <div className="small text-muted">x{item.qty}</div>
                                    </div>
                                    <div className="text-end">
                                        <small>Rs.{item.price * item.qty}</small>
                                        <span
                                            onClick={() => RemoveItem(item.id)}
                                            className="text-danger ms-2 pointer"
                                            title="Remove"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <i className="bi bi-x-circle-fill"></i>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <hr />

                        <div className="d-flex justify-content-between small">
                            <span>Shipping</span>
                            <span>Rs.{shippingCost.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between fw-bold">
                            <span>Total</span>
                            <span>Rs.{(total + shippingCost).toFixed(2)}</span>
                        </div>

                        <div className="mt-3 d-grid gap-2">
                            <Link to="/cart" className="btn btn-outline-dark btn-sm">View Cart</Link>
                            <Link to="/checkout" className="btn btn-dark btn-sm">Checkout</Link>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-muted">Cart is empty</div>
                )}
            </ul>
        </div>
    );
};

export default MiniCart;
