import { Helmet } from 'react-helmet-async';

import Layout from "../components/layout/layout";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeItem, updateQuantity } from "../store/cartSlice";
import toast from 'react-hot-toast';
import "./cart.css";
import CartSummary from "../components/cart/CartSummary";

const DEFAULT_SHIPPING = 50;

const Cart = () => {
    const cartData = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const [cart, setCart] = useState([]);
    const [updatedQTY, setUpdateQTY] = useState({});
    const [total, setTotal] = useState(0);
    const [shippingCost, setShippingCost] = useState(0);
    const [canCheckout, setCanCheckout] = useState(true);

    useEffect(() => {
        setCart(cartData.cart);

        const totalAmount = cartData.cart.reduce((acc, curr) => acc + (Number(curr.price) * Number(curr.qty)), 0);

        const totalShippingCost = cartData.cart.reduce((acc, curr) => {
            const itemShipping = Number(curr.shippingCost || DEFAULT_SHIPPING);
            return acc + (itemShipping * Number(curr.qty));
        }, 0);

        const hasInvalidQty = cartData.cart.some(item => Number(item.qty) < 1 || isNaN(Number(item.qty)));

        setTotal(totalAmount);
        setShippingCost(totalShippingCost);
        setCanCheckout(!hasInvalidQty);
    }, [cartData]);

    const removeCartItem = (id) => {
        if (window.confirm("Do You Really Want to Remove Item from Cart?")) {
            dispatch(removeItem(id));
            toast.error("Item Successfully Removed from Cart!");
        }
    };

    const UpdateCartItem = (id) => {
        const qty = updatedQTY[id];
        if (!qty || qty < 1) return toast.error("Invalid Quantity");

        dispatch(updateQuantity({ id, qty }));
        toast.success("Successfully Updated!");
    };

    if (cart.length < 1) {
        return (
            <Layout>
                <h1 className="text-center mt-3">Cart Details</h1>
                <p className="text-center mt-2">Your Shopping Cart is Empty <Link to="/">Click Here to Shop.</Link></p>
            </Layout>
        );
    }
const handleChangeQuantity    =    (id,value)=>{
setUpdateQTY(prev => ({ ...prev, [id]: Number(value) }));
UpdateCartItem(id);
}
    return (
        <Layout>
            <Helmet>
                <title>Cart View - Mian Motorcycle Parts Raiwind</title>
                <meta name="description" content="Cart View, Mian Motorcycle Parts, Honda 70, CG125, Location Kasur Road Raiwind" />
            </Helmet>
            <div className="container">
                <h1 className="my-3">Shopping Cart</h1>
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Parts Name</th>
                                <th>Manufacturer & Model</th>
                                <th>Qty</th>
                                <th>Unit Price</th>
                                <th>Shipping</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item, i) => {
                                const itemShipping = Number(item.shippingCost || DEFAULT_SHIPPING);
                                return (
                                    <tr key={i}>
                                        <td><img src={item.photo} alt={item.name} width="45" /></td>
                                        <td>{item.name}<br />{item.urduName}</td>
                                        <td>{item.category}<br />{item.manufacturer}</td>
                                        <td>
                                            <div className="input-group">
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    defaultValue={item.qty}
                                                    onChange={(e) => handleChangeQuantity(item.id,e.target.value)}
                                                />
                                                <button className="btn btn-primary" onClick={() => UpdateCartItem(item.id)}><i className="bi bi-arrow-clockwise"></i></button>
                                                <button className="btn btn-danger" onClick={() => removeCartItem(item.id)}><i className="bi bi-x-circle"></i></button>
                                            </div>
                                        </td>
                                        <td>Rs. {item.price}</td>
                                        <td>Rs. {itemShipping} x {item.qty}</td>
                                        <td>Rs. {item.price * item.qty}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="d-flex justify-content-end">
                    <CartSummary total={total} shippingCost={shippingCost} canCheckout={canCheckout} />
                </div>

                <div className="d-flex justify-content-between">
                    <Link className="btn btn-outline-secondary" to="/">⬅️ Continue Shopping</Link>
                    <Link className={`btn btn-primary ${!canCheckout && 'disabled'}`} to={canCheckout ? "/checkOut" : "#"}>
                        ✅ Proceed to Checkout
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default Cart;
