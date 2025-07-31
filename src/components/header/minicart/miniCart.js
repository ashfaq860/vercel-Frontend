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
        const totalAmount = cart?.cart?.reduce((acc, curr) => Number(acc) + (Number(curr.price) * Number(curr.qty)), 0);
        const totalShipping = cart?.cart?.reduce((acc, curr) => Number(acc) + (Number(curr.shippingCost) * Number(curr.qty)), 0);
        setTotal(totalAmount);
        setShippingCost(totalShipping);
    }, [cart.cart]);

    const RemoveItem = (id) => {
        dispatch(removeItem(id));
    };

    return (
        <>
            <div className="shoping-cart min-shopping-cart" style={{ width: '225px' }}>
                <div className="btn-shoppingCart">
                    <div className="dropdown">
                        <div className="btn dropdown-toggle1" id="dropdownMenuButton1 cartButton" data-bs-toggle="dropdown" aria-expanded="false" role="button">
                            <div className="basket-icon">
                                <span className="bskt-icon"><i className="bi bi-basket"></i></span>
                                <span className="bskt-qty">{miniCart.length < 10 ? '0' : ''}{miniCart.length}</span>
                            </div>
                            <div className="basket-txt">
                                <span>My Cart</span>
                                <span className="cart-Item-Price">RS.{total}</span>
                            </div>
                        </div>

                        <ul className="dropdown-menu p-2" aria-labelledby="dropdownMenuButton1">
                            {miniCart?.length > 0 ? (
                                <>
                                    <li>
                                        <table className="table table-hover align-middle mb-2">
                                            <tbody>
                                                {miniCart.map((p, i) => (
                                                    <tr key={p.id}>
                                                        <td className="text-center">
                                                            <Link to={`/parts/${p.id}`}>
                                                                <img src={p.photo} alt={p.name} title={p.name} height="45" width="45" className="img-thumbnail" />
                                                            </Link>
                                                        </td>
                                                        <td>
                                                            <small className="d-block">{p.name}</small>
                                                            <small className="text-muted">Qty: {p.qty}</small>
                                                        </td>
                                                        <td className="text-end">
                                                            <div className="d-flex flex-column align-items-end">
                                                                <span>Rs.{p.price * p.qty}</span>
                                                                <span
                                                                    className="text-danger delete-icon"
                                                                    onClick={() => RemoveItem(p.id)}
                                                                    title="Remove Item"
                                                                >
                                                                    <i className="bi bi-trash-fill fs-6"></i>
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </li>
                                    <li>
                                        <table className="table table-sm table-borderless mb-2">
                                            <tbody>
                                                <tr>
                                                    <td><strong>Sub-Total</strong></td>
                                                    <td className="text-end">Rs.{total}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Flat Shipping</strong></td>
                                                    <td className="text-end">Rs.{shippingCost}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Total</strong></td>
                                                    <td className="text-end">Rs.{Number(total) + Number(shippingCost)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className="d-flex justify-content-between">
                                            <Link className="btn btn-sm btn-outline-secondary" to="/cart">
                                                <i className="bi bi-cart"></i> View Cart
                                            </Link>
                                            <Link className="btn btn-sm btn-primary" to="/checkout">
                                                <i className="bi bi-credit-card"></i> Checkout
                                            </Link>
                                        </div>
                                    </li>
                                </>
                            ) : (
                                <li className="text-center text-muted py-2">Your cart is empty.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            <style jsx="true">{`
                .delete-icon {
                    cursor: pointer;
                    transition: color 0.2s ease;
                }
                .delete-icon:hover {
                    color: #dc3545;
                }
                .basket-txt {
                    display: flex !important;
                    flex-direction: column !important;
                    margin-left: 5px !important;
                }
                .basket-icon {
                    position: relative !important;
                }
                .bskt-qty {
                    position: absolute !important;
                    top: -5px !important;
                    right: -10px !important;
                    background: red !important;
                    color: white !important;
                    font-size: 12px !important;
                    width: 20px !important;
                    height: 20px !important;
                    border-radius: 50% !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
            `}</style>
        </>
    );
};

export default MiniCart;
