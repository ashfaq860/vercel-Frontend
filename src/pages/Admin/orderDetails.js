
import { Helmet } from 'react-helmet-async';

import React, { useState, useEffect } from "react";
import { orderById, changeStatus } from "../../api/internal";
import { Link,useNavigate,useParams } from "react-router-dom";
import AdminLayout from "../../components/layout/adminLayout";
import './order.css';
import './sort.css';
import { useDispatch, useSelector } from "react-redux";
import toast from 'react-hot-toast';
import GoBack from "../loader/goBack";
const OrderDetails = () => {
    const { id } = useParams();
    const role = useSelector(state => state.user.role);
    const navigate = useNavigate();
    const { OId } = useParams();
    const [order, setOrder] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [province, setProvince] = useState("");
    const [city, setCity] = useState("");
    const [email, setEmail] = useState("");

    const getOrder = async () => {
        const { data } = await orderById(id);

        setOrder(data.order);
        setItems(data.order.items);
        setName(data.order.shippingAddress.name);
        setPhone(data.order.shippingAddress.phone);
        setEmail(data.order.shippingAddress.email);
        setAddress(data.order.shippingAddress.address);
        setProvince(data.order.shippingAddress.province);
        setCity(data.order.shippingAddress.city);

    }
    useEffect(() => {
        getOrder();
    }, [id]);
    //console.log(order)

    const handleStatusChange = async (e) => {
        if (e.target.value === "")
            return;
        const check = window.confirm(`Do you really want to set the status ${e.target.value} ?`);
        setSelectedStatus(e.target.value);
        if (check) {

            const data = {
                orderNo: id,
                status: e.target.value
            }
            // console.log(data);
            const res = await changeStatus(data);
            if (res.data.status.modifiedCount === 1) {

                toast.success(`Order status has been set to ${selectedStatus}!`);
                getOrder();
            }
        } else {
            setSelectedStatus("");
        }


    }
    return (<>
        <AdminLayout>

            <Helmet>
                <title>Cart View, Mian Motorcycle Parts Raiwind- All kind of motocycle parts shop</title>
                <meta name="description" content="Cart View, Mian Motocycle Parts, Honda 70 , CG125, China 70, Uniter 100, Ching CHi Rickshaw, Location Kasur Road Raiwind" />
            </Helmet>

            <div className="col-xl-10 col-md-9 col-sm-8 col-9">
                <div className="row mt-1">
                    <h2 className={`  alert text-center status status-${(order.status)}`}> <GoBack link="/admin/orders/all" title="Go Back" /> Order  is <b> {order.status}.</b>
                        &nbsp;
                        {role === 1 ? (<>
                            <label>
                               
                                <select id="sortOrder" value={selectedStatus} onChange={(e) => handleStatusChange(e)}>
                                    <option value="">-- Change Status --</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Canceled">Canceled</option>
                                </select>
                            </label>

 </>) : (<></>)}
                    </h2>
                    <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12 mt-2 text-center">
                        <div className="alert alert-danger" role="alert">
                        <h3>Order#:</h3>
                            <p>{order.orderNumber}</p>
                        </div>
                    </div>

                    <div className=" col-lg-3 col-md-6 col-sm-6 col-xs-12 mt-2 text-center">
                        <div className="alert alert-info" role="alert">
                        <h3>Date:</h3>
                        <p>{order.createdAt}</p>
                        </div>
                        </div>

                   

                    <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12 mt-2 text-center">
                        <div className="alert alert-secondary" role="alert">
                        <h3>P.Mathod:</h3>
                            <p>{order.paymentMethod}</p>
                            </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12 mt-2 text-center">
                        <div className="alert alert-success" role="alert">
                            <h3>Total:</h3>
                            <p>Rs.{order.total}</p>
                        </div>
                    </div>

                </div>

                <div className="row mt-3">
                    <div className="col-md-4 col-sm-12">
                        <h3 className="text-center">Shipping Address</h3>

                        <div className="table-responsive">
                            <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <th>Name:</th>
                                    <td>{name}</td>
                                </tr>
                                <tr>
                                    <th>Cell#:</th>
                                    <td>{phone}</td>
                                </tr>
                                <tr>
                                    <th>E-mail:</th>
                                    <td>{email}</td>
                                </tr>
                                <tr>
                                    <th>Province:</th>
                                    <td>{province}</td>
                                </tr>
                                <tr>
                                    <th>City:</th>
                                    <td>{city}</td>
                                </tr>
                                <tr>
                                    <th>Address:</th>
                                    <td>{address}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-md-8 col-sm-12">
                        <h3 className="text-center">Items Detail</h3>
                        <div className="table-responsive">
                            <table className="table table-bordered text-center">
                                <thead>
                                    <tr>
                                        <th scope="col">Parts Name</th>
                                        <th scope="col"> Manufacturer&Model</th>
                                        <th scope="col">Quantity</th>
                                        <th scope="col">Unit Price</th>
                                        <th scope="col">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        items.map((p, i) => (
                                            <tr key={i}>

                                                <td>{p.name} <br />{p.urduName}</td>
                                                <td>{p.category} <br /> {p.manufacturer}<br /> </td>
                                                <td>
                                                    {p.qty}
                                                </td>
                                                <td>{p.price}</td>
                                                <td>{p.price * p.qty}</td>
                                            </tr>
                                        ))

                                    }
                                </tbody>
                            </table>
                         </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    </>)
}
export default OrderDetails;