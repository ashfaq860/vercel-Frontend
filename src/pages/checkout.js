import { Helmet } from 'react-helmet-async';

import Layout from "../components/layout/layout";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { emptyCart, removeItem, updateQuantity } from "../store/cartSlice";
import { toast } from 'react-hot-toast';
import { findUser, placeOrder, sendOrderMailToClient } from "../api/internal";
import { setUser } from "../store/userSlice";
import LoadingButton from "./loader/loadingButton";

import "./cart.css";

const CheckOut = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector(state => state.user);
    const cartData = useSelector((state) => state.cart);
    const [cart, setCart] = useState([]);
    const [shippingCost, setShippingCost] = useState(50);
    const [total, setTotal] = useState(0);
    const [profit, setProfit] = useState(0);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [userId, setUserId] = useState("");
    const [city, setCity] = useState("");
    const [province, setProvince] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [loading, setLoading] = useState(false);
    const [updatedQTY, setUpdateQTY] = useState(0);

    useEffect(() => {
        setName(user.username);
        setPhone(user.phone);
        setAddress(user.address);
        setEmail(user.email);
        setCity(user.city);
        setProvince(user.province);
        setUserId(user._id);
    }, [user]);

    useEffect(() => {
        const totalAmount = cartData.cart.reduce((acc, curr) => Number(acc) + (curr.price * curr.qty), 0);
        const totalProfit = cartData.cart.reduce((acc, curr) => Number(acc) + (curr.profit * curr.qty), 0);
        const totalShipping = cartData.cart.reduce((acc, curr) => acc + ((curr.shippingCost || 50) * curr.qty), 0);

        setCart(cartData.cart);
        setTotal(totalAmount);
        setProfit(totalProfit);
        setShippingCost(totalShipping);
    }, [cartData]);

    const removeCartItem = (id) => {
        const c = window.confirm("Do You Really Want to Remove Item from Cart?");
        if (c) {
            dispatch(removeItem(id));
            toast.error("Item Removed from Cart!");
        }
    };

    const UpdateCartItem = (id) => {
        const data = { id, qty: updatedQTY };
        dispatch(updateQuantity(data));
        toast.success("Cart Updated!");
    };

    const handleConfirmOrder = async (e) => {
        e.preventDefault();
        setLoading(true);

        const randomNumber = Math.floor(Math.random() * 900) + 100;
        const date = new Date();
        const orderNo = `ORD-${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}-${randomNumber}`;

        const orderData = {
            items: cart,
            paymentMethod,
            customer: userId,
            orderNumber: orderNo,
            total: total + shippingCost,
            profit,
            subTotal: total,
            shippingCost,
            shippingAddress: { name, email, phone, address, province, city }
        };
        console.log(orderData)
      // let data;
      const { data } = await placeOrder(orderData);
        if (data) {
            /**  start Send order Email To user function */
            try {


                const response = await sendOrderMailToClient({ order: orderData });
                // console.log(response);
                if (response.status === 200) {
                    setLoading(false);
                    toast.success("Order placed successfully! Check Your Email");
                   

                   
                    dispatch(emptyCart());

                    const user = {
                        _id: data.order.customer,
                        email: data.order.shippingAddress.email,
                        username: data.order.shippingAddress.name,
                        phone: data.order.shippingAddress.phone,
                        address: data.order.shippingAddress.address,
                        province: data.order.shippingAddress.province,
                        city: data.order.shippingAddress.city,
                        auth: true,
                        role: data.order.shippingAddress.role,
                    };

                    dispatch(setUser(user));
                    navigate(`/order-Received/${data.order.orderNumber}`);
                } else if (response.status === 500) {
                    setLoading(false);
                    toast.error("Failed to send invoice");
                }
            } catch (err) {
                setLoading(false);
                console.error(err);
                toast.error("Server error while sending invoice");
            }
            /** End send order email to user function*/
           
        }
    };

    const fetchUser = async (email) => {
        if (email !== "") {
            const { data } = await findUser(email);
            if (data?.user !== null) {
                setName(data?.user?.name);
                setPhone(data?.user?.phone);
                setAddress(data?.user?.address);
                setEmail(data?.user?.email);
                setUserId(data?.user?._id);
                setCity(data?.user?.city);
                setProvince(data?.user?.province);
            }
        }
    };

    if (cart.length < 1) {
        return (
            <Layout>
                <h1 className="text-center mt-3">Cart Details</h1>
                <p className="text-center mt-2">
                    Your Shopping Cart is Empty <Link to="/">Click Here to Shop.</Link>
                </p>
            </Layout>
        );
    }

    return (
        <Layout>
            <Helmet>
                <title>Checkout - Mian Motorcycle Parts Raiwind</title>
                <meta name="description" content="Cart View, Honda 70 , CG125, China 70, Ching Chi Rickshaw, Location Kasur Road Raiwind" />
            </Helmet>
            <div className="container">
                <form onSubmit={handleConfirmOrder}>
                    <div className="row mt-4">
                        <div className="col-md-4 col-sm-12">
                            <div className="card shadow-none">
                                <div className="card-header addressTitle">
                                    <i className="bi bi-truck"></i> Shipping Details
                                </div>
                                <div className="card-body">
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Full Name</label>
                                        <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">E-Mail</label>
                                        <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={(e) => fetchUser(e.target.value)} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="cellNo" className="form-label">Cell No</label>
                                        <input
                                            type="tel"
                                            pattern="\d{11}"
                                            className="form-control"
                                            id="cellNo"
                                            value={phone}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (/^\d{0,11}$/.test(val)) {
                                                    setPhone(val);
                                                }
                                            }}
                                            required
                                        />

                                        
                                    </div>
                                    <label htmlFor="province" className="form-label">Province</label>
                                    <input className="form-control" list="datalistOptions" id="province" value={province} onChange={(e) => setProvince(e.target.value)} placeholder="Type for province..." required />
                                    <datalist id="datalistOptions">
                                        <option value="Punjab" />
                                        <option value="Sindh" />
                                        <option value="KPK" />
                                        <option value="Blochistan" />
                                        <option value="Gilgit" />
                                    </datalist>
                                    <div className="mb-3">
                                        <label htmlFor="city" className="form-label">City</label>
                                        <input type="text" className="form-control" id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="address" className="form-label">Shipping Address</label>
                                        <textarea className="form-control" id="address" rows="3" value={address} onChange={(e) => setAddress(e.target.value)} required></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-8">
                            <h2>Payment Methods</h2>
                            <div className="d-flex justify-content-between mb-3">
                                {["CashOnDelivery", "JazzCash", "EasyPaisa"].map(method => (
                                    <div className="form-check" key={method}>
                                        <input className="form-check-input" type="radio" name="paymentMethod" value={method} onChange={(e) => setPaymentMethod(e.target.value)} required />
                                        <label className="form-check-label" htmlFor={method}>{method}</label>
                                    </div>
                                ))}
                            </div>

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
                                                    value={item.qty}
                                                    onChange={(e) => {
                                                        const newQty = Number(e.target.value);
                                                        if (newQty >= 1 && !isNaN(newQty)) {
                                                            dispatch(updateQuantity({ id: item.id, qty: newQty }));
                                                        }
                                                    }}
                                                />
                                                <button className="btn btn-danger" onClick={() => removeCartItem(item.id)}>
                                                    <i className="bi bi-x-circle"></i>
                                                </button>
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
                                <div className="col-5">
                                    <table className="table table-bordered">
                                        <tbody>
                                            <tr>
                                                <td className="text-end"><strong>Sub-Total:</strong></td>
                                                <td className="text-end">Rs. {total}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-end"><strong>Total Shipping:</strong></td>
                                                <td className="text-end">Rs. {shippingCost}</td>
                                            </tr>
                                            <tr className="table-success">
                                                <td className="text-end"><strong>Grand Total:</strong></td>
                                                <td className="text-end"><strong>Rs. {total + shippingCost}</strong></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="d-flex justify-content-end">
                               
                                <button
                                    type="submit"
                                    className="btn btn-success w-100 mb-3 shadow-lg border-0 fs-5 py-2"
                                    style={{ transition: "all 0.3s ease", letterSpacing: "0.5px" }}
                                    onMouseEnter={(e) => (e.target.style.transform = "scale(1.03)")}
                                    onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                                   
                                >
                                   
                                    <LoadingButton loading={loading} title=" 🚀 Confirm & Place Order" />
                                </button>

                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default CheckOut;
