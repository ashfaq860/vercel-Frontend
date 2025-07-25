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
       // console.log(cart.cart);

        let totalAmount = cart?.cart?.reduce((acc, curr) => Number(acc) + (Number(curr.price) * Number(curr.qty)), 0);
        let totalShippingCost = cart?.cart?.reduce((acc, curr) => Number(acc) + (Number(curr.shippingCost) * Number(curr.qty)), 0);
        setShippingCost(totalShippingCost);
        setTotal(totalAmount);
    }, [cart.cart]);
    const RemoveItem = (id) => {
       dispatch(removeItem(id));
    }
    return (<>
        <div className="shoping-cart min-shopping-cart" style={{"width":"225px"} }>
            <div className="btn-shoppingCart">
                <div className="dropdown">
                    <div className="btn dropdown-toggle1" id="dropdownMenuButton1 cartButton" data-bs-toggle="dropdown" aria-expanded="false" role="button">
                        <div className="basket-icon">
                            <span className="bskt-icon"><i className="bi bi-basket"></i></span>
                            <span className="bskt-qty">{miniCart.length < 10 ? "0" : ""}{miniCart.length}</span>
                        </div>
                        <div className="basket-txt">
                            <span>My Cart</span> <span className="cart-Item-Price">RS.{total}</span>
                        </div>
                    </div>
                    { miniCart?.length > 0 ? (
                        <>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li>
                                    <table className="table table-striped">
                                        <tbody>
                                            {
                                                miniCart?.map((p, i) => (
                                                <tr>
                                                        <td className="text-center">
                                                            <Link to={`/parts/${p.id}`}>
                                                                <img src={p.photo} alt={p.name} title={p.name} className="img-responsive" height="45" width="45" />
                                                                { p._id}
                                                            </Link>
                                                        </td>
                                                        <td className="text-left" colSpan="2">
                                                            <small>  {p.name}</small>
                                                        </td>
                                                        <td className="text-center">x{p.qty}</td>
                                                        <td className="text-center">Rs.{p.price * p.qty}</td>

                                                        <td className="text-right">
                                                            <a className="text-danger" onClick={() => RemoveItem(p.id)}>x</a>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </li>
                                <li>
                                    <div>
                                        <table className="table table-bordered">
                                            <tbody>
                                                <tr>
                                                    <td className="text-left"><strong>Sub-Total</strong>
                                                    </td>
                                                    <td className="text-right">Rs.{ total}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-left"><strong>Flat Shipping</strong>
                                                    </td>
                                                    <td className="text-right">Rs.{ shippingCost}</td>
                                                </tr>

                                                <tr>
                                                    <td className="text-left"><strong>Total</strong>
                                                    </td>
                                                    <td className="text-right">Rs.{ Number(total)+Number(50) }</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <p className="text-right"> <Link className="btn view-cart" to="/cart"><i className="fa fa-shopping-cart"></i>View Cart</Link>&nbsp;&nbsp;&nbsp; <Link className="btn btn-mega checkout-cart" to="/checkout"><i className="fa fa-share"></i>Checkout</Link>
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </>
                    ) : (<><ul className="dropdown-menu p-2 ms-2" aria-labelledby="dropdownMenuButton1">
                        <li>Cart Empty</li></ul></>)
                    }
                </div>
            </div>
        </div>

    </>);
}
export default MiniCart;