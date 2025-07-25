import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/adminLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, changeStatus } from "../../api/internal";
import toast from 'react-hot-toast';
import './order.css'
import { Link } from "react-router-dom";
import './sort.css';
import Loader from "../loader/loader";
import Pagination from "../../components/products/item/pagination";
const AllOrders = () => {
    const id = useSelector(state => state.user._id);
    const [orders, setOrders] = useState([]);
    const [updateOrder, setUpdateOrder] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState("");

  
    const getOrders = async () => {
        const res = await getAllOrders();
        // const res = await getUserOrders(id);
        setOrders(res.data.orders);
    }
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
    const cancelMyOrder = async (orderId, status) => {
        const check = window.confirm("Do you really want to cancel the Order?");
        if (check) {
            if (status !== "Pending") {
                toast.error("Your Order is in" + status + "! Your can't cancel now.")
                return;
            }
            const data = {
                orderNo: orderId,
                status: "Canceled"
            }
            const res = await changeStatus(data);
            console.log(res)
            if (res.data.status.modifiedCount === 1) {
                setUpdateOrder(res.data.status.modifiedCount);
                toast.error("Your Order has been cancel!");
                getOrders();
            }
        }
    }

    const handleSortChange = (e) => {
        setSelectedStatus(e.target.value);
    };

  
    useEffect(() => {
        getOrders();
    }, []);



    return (<>
        <AdminLayout>
            {orders.length === 0 ? (<><Loader text="Products" /></>)
                : (<>
                    <div className="col-auto col-sm-8 col-md-9 col-xl-10 px-sm-10">
                        <h2 className="text-center p-3">All Orders &nbsp;&nbsp;
                    <label>
                        
                        <select id="sortOrder" value={selectedStatus} onChange={handleSortChange}>
                            <option value="">-- Change Status --</option>
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Canceled">Canceled</option>
                            
                           
                            
                            
                        </select>
                    </label>

                </h2>
                <div className="table-responsive">
                    <table className="table">
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
                                        <button className="btn btn-danger" onClick={() => cancelMyOrder(order.orderNumber, order.status)} alt="Cancel Order" title="Cancel Order"><i className="bi bi-x-lg"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                            </table>
                            <Pagination totalPosts={orders.length} postPerPage={orderPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage} />
                </div>
                    </div>
                </>)}
        </AdminLayout>
    </>)
}
export default AllOrders;