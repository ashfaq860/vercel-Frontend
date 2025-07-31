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
        setMiniCart(cart.cart || []);
        const totalAmount = cart.cart?.reduce((acc, curr) => acc + (curr.price * curr.qty), 0) || 0;
        const totalShipping = cart.cart?.reduce((acc, curr) => acc + (curr.shippingCost * curr.qty), 0) || 0;
        setTotal(totalAmount);
        setShippingCost(totalShipping);
    }, [cart.cart]);

    const RemoveItem = (id) => dispatch(removeItem(id));

    return (
        <div className="minicart-wrapper position-relative">
            <div className="dropdown">
                <button
                    className="btn border-0 dropdown-toggle d-flex align-items-center gap-2"
                    id="cartDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    <div className="position-relative">
                        <i className="bi bi-bag-fill fs-4 text-dark"></i>
                        {miniCart.length > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {miniCart.length}
                            </span>
                        )}
                    </div>
                    <div className="d-flex flex-column text-start">
                        <small className="text-muted">My Cart</small>
                        <strong>Rs. {total}</strong>
                    </div>
                </button>

                <ul
                    className="dropdown-menu dropdown-menu-end shadow p-3 rounded-3"
                    aria-labelledby="cartDropdown"
                    style={{ minWidth: '320px', maxWidth: '400px' }}
                >
                    {miniCart.length > 0 ? (
                        <>
                            <div className="mb-3">
                                {miniCart.map((item, idx) => (
                                    <div key={idx} className="d-flex mb-2 border-bottom pb-2">
                                        <Link to={`/parts/${item.id}`}>
                                            <img
                                                src={item.photo}
                                                alt={item.name}
                                                height="50"
                                                width="50"
                                                className="rounded me-2"
                                            />
                                        </Link>
                                        <div className="flex-grow-1">
                                            <h6 className="mb-1">{item.name}</h6>
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Qty: {item.qty}</span>
                                                <span>Rs. {item.qty * item.price}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => RemoveItem(item.id)}
                                            className="btn btn-sm btn-link text-danger ms-2"
                                            title="Remove"
                                        >
                                            <i className="bi bi-x-circle"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="border-top pt-2 mb-2">
                                <div className="d-flex justify-content-between">
                                    <span>Sub-total:</span>
                                    <strong>Rs. {total}</strong>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Shipping:</span>
                                    <strong>Rs. {shippingCost}</strong>
                                </div>
                                <div className="d-flex justify-content-between border-top pt-2 mt-2">
                                    <span>Total:</span>
                                    <strong>Rs. {Number(total) + Number(shippingCost)}</strong>
                                </div>
                            </div>

                            <div className="d-flex justify-content-between mt-3">
                                <Link to="/cart" className="btn btn-outline-dark btn-sm w-50 me-1">
                                    <i className="bi bi-cart-check"></i> View Cart
                                </Link>
                                <Link to="/checkout" className="btn btn-dark btn-sm w-50 ms-1">
                                    <i className="bi bi-box-arrow-right"></i> Checkout
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-muted py-3">
                            <i className="bi bi-bag-x fs-2 mb-2"></i>
                            <p className="mb-0">Your cart is empty</p>
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default MiniCart;
