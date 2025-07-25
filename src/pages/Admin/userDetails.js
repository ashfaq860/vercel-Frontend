
import { Helmet } from 'react-helmet-async';

import React, { useState, useEffect } from "react";
import { orderByUserId, changeStatus } from "../../api/internal";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/layout/adminLayout";
import './order.css';
import { useDispatch, useSelector } from "react-redux";
import "./sort.css";
import GoBack from "../loader/goBack";
import Pagination from "../../components/products/item/pagination";
const UserDetails = () => {
    const { id } = useParams();
    const role      = useSelector(state => state.user.role);
    const navigate  = useNavigate();
    const [orders, setOrders] = useState([]);
    const [customer, setCustomer] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("");
   const getUserOrder = async () => {
        const { data } = await orderByUserId(id);
        setCustomer(data?.customer);
        setOrders(data?.orders);
        console.log(orders);
        //setOrders(data.order);
    }
    useEffect(() => {
        getUserOrder();
   }, [id]);

  
    const handleSortChange = (e) => {
        setSelectedStatus(e.target.value);
    };
    const sortedOrders = [...orders].sort((a, b) => {
        // If no selection, show default
        if (!selectedStatus) return 0;
 // Put selected status on top
        if (a.status === selectedStatus && b.status !== selectedStatus) return -1;
        if (b.status === selectedStatus && a.status !== selectedStatus) return 1;

        return 0; // No change
    });
    // pagination functions
    const [orderPerPage, setOrderPerPaage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const lastPostIndex = currentPage * orderPerPage;
    const firstPostIndex = lastPostIndex - orderPerPage;
    const currentOrders = (sortedOrders ?? orders).slice(firstPostIndex, lastPostIndex);

    return (<>
        <AdminLayout>

            <Helmet>
                <title>Cart View, Mian Motorcycle Parts Raiwind- All kind of motocycle parts shop</title>
                <meta name="description" content="Cart View, Mian Motocycle Parts, Honda 70 , CG125, China 70, Uniter 100, Ching CHi Rickshaw, Location Kasur Road Raiwind" />
            </Helmet>

            <div className="col-xl-10 col-md-9 col-sm-8 col-9">
                <div className="row mt-1">
                        <div className="col-12">
                        <h2 className="alert alert-info text-center status"> <GoBack link="/admin/users" title="Go Back" /> Orders Of { customer.name}. </h2>
                       </div>
                </div>


                <div className="row">
                <div className="col-12">
                   <div className="row">
                       <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12 mt-2 text-center">
                            <div className="alert alert-danger" role="alert">
                                <h3>Name#:</h3>
                                <p><b>{customer?.name}</b></p>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12 mt-2 text-center">
                            <div className="alert alert-info" role="alert">
                                <h3>Email:</h3>
                                <p>{customer?.email}</p>
                            </div>
                        </div>

                            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12 mt-2 text-center">
                                <div className="alert alert-info" role="alert">
                                    <h3>Phone:</h3>
                                    <p>{customer?.phone}</p>
                                </div>
                            </div>

                        <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12 mt-2 text-center">
                            <div className="alert alert-success" role="alert">
                                <h3>Total Orders:</h3>
                                    <p><b>{orders?.length}</b></p>
                            </div>
                            </div>
                            <div className="col-12 mt-2 text-center">
                                <div className="alert alert-secondary" role="alert">
                                    <h3>Address:</h3>
                                    <p>
                                        {customer?.province}-{customer?.city} <br />
                                        {customer?.address}
                                    </p>
                                </div>
                            </div>
                          </div>
                     </div>
                </div>
            <hr />
        <div className="row">
                <div className="col-12">
                        <h3 className="text-center"> Orders Detail &nbsp;&nbsp; 
                            <select id="sortOrder" value={selectedStatus} onChange={handleSortChange}>
                                    <option value="">-Select sorting-</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Canceled">Canceled</option>




                                </select>
                            
                        </h3>
                        <div className="table-responsive">
                            <table className="table text-center">
                                <thead>
                                    <tr> 
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Date</th>
                                        <th>Total</th>
                                        <th>Payment</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentOrders.map(order => (
                                        <tr key={order._id} className={`status status-${order.status.toLowerCase()}`}>
                                            <td className={`status status-${order.status}`}>{order.orderNumber}</td>
                                            <td className={`status status-${order.status}`}>{order.shippingAddress.name}</td>
                                            <td className={`status status-${order.status}`}>{order.createdAt}</td>
                                            <td className={`status status-${order.status}`}>${order.total}</td>
                                            <td className={`status status-${order.status}`}>{order.paymentMethod}</td>
                                            <td className={`status status-${order.status}`}>
                                                <span className={`status ${order.status}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className={`status status-${order.status.toLowerCase()}`}>
                                                <Link to={`/admin/order/viewDetails/${order.orderNumber}`} className="btn btn-primary" alt="View Detail" title="View Detail"><i className="bi bi-eye"></i></Link>
                                               </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Pagination totalPosts={orders.length} postPerPage={orderPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage} />

                            </div>
                        </div>
                </div>
                </div>
            
        </AdminLayout>
    </>)
}
export default UserDetails;