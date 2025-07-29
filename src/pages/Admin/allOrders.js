import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/adminLayout";
import { useSelector } from "react-redux";
import { getAllOrders, changeStatus } from "../../api/internal";
import toast from 'react-hot-toast';
import { Link } from "react-router-dom";
import Loader from "../loader/loader";
import Pagination from "../../components/products/item/pagination";

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [orderPerPage, setOrderPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const getOrders = async () => {
        setLoading(true);
        try {
            const res = await getAllOrders();
            setOrders(res.data.orders);
        } catch (error) {
            toast.error("Failed to load orders");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const sortedOrders = [...orders].sort((a, b) => {
        if (!selectedStatus) return 0;
        if (a.status === selectedStatus && b.status !== selectedStatus) return -1;
        if (b.status === selectedStatus && a.status !== selectedStatus) return 1;
        return 0;
    });

    // Pagination
    const lastPostIndex = currentPage * orderPerPage;
    const firstPostIndex = lastPostIndex - orderPerPage;
    const currentOrders = (sortedOrders ?? orders).slice(firstPostIndex, lastPostIndex);

    const cancelOrder = async (orderId, status) => {
        const check = window.confirm("Do you really want to cancel this order?");
        if (check) {
            if (status !== "Pending") {
                toast.error(`Your order is ${status}! You can't cancel now.`);
                return;
            }
            try {
                const data = { orderNo: orderId, status: "Canceled" };
                const res = await changeStatus(data);
                if (res.data.status.modifiedCount === 1) {
                    toast.error("Order has been canceled!");
                    getOrders();
                }
            } catch (error) {
                toast.error("Failed to cancel order");
                console.error(error);
            }
        }
    };

    const handleSortChange = (e) => {
        setSelectedStatus(e.target.value);
        setCurrentPage(1);
    };

    useEffect(() => {
        getOrders();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusBadgeClass = (status) => {
        switch(status.toLowerCase()) {
            case 'pending': return 'bg-warning text-dark';
            case 'processing': return 'bg-info text-white';
            case 'shipped': return 'bg-primary text-white';
            case 'delivered': return 'bg-success text-white';
            case 'canceled': return 'bg-danger text-white';
            default: return 'bg-secondary text-white';
        }
    };

    return (
        <AdminLayout>
          <div className="col-auto col-md-9 col-xl-10 px-sm-10">
            <div className="container-fluid py-3">
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-bottom-0 py-3">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                            <h2 className="h5 mb-3 mb-md-0">Order Management</h2>
                            <div className="d-flex align-items-center">
                                <select 
                                    className="form-select form-select-sm me-2 w-auto" 
                                    value={selectedStatus} 
                                    onChange={handleSortChange}
                                >
                                    <option value="">All Statuses</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Canceled">Canceled</option>
                                </select>
                                <span className="badge bg-light text-dark">
                                    {orders.length} orders
                                </span>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="card-body text-center py-5">
                            <Loader text="Loading orders..." />
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="card-body text-center py-5">
                            <h5 className="text-muted">No orders found</h5>
                        </div>
                    ) : (
                        <>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="ps-3">Order #</th>
                                                <th>Customer</th>
                                                <th>Date</th>
                                                <th>Total</th>
                                                <th>Payment</th>
                                                <th>Status</th>
                                                <th className="pe-3">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentOrders.map(order => (
                                                <tr key={order._id}>
                                                    <td className="ps-3 fw-semibold">#{order.orderNumber}</td>
                                                    <td>{order.shippingAddress?.name || 'N/A'}</td>
                                                    <td>{formatDate(order.createdAt)}</td>
                                                    <td>Rs.{order.total?.toFixed(2)}</td>
                                                    <td>
                                                        <span className="badge bg-light text-dark text-uppercase">
                                                            {order.paymentMethod}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="pe-3">
                                                        <div className="d-flex gap-2">
                                                            <Link 
                                                                to={`/admin/order/viewDetails/${order.orderNumber}`}
                                                                className="btn btn-sm btn-outline-primary"
                                                                title="View Details"
                                                            >
                                                                <i className="bi bi-eye"></i>
                                                            </Link>
                                                            <button 
                                                                className={`btn btn-sm ${order.status === "Pending" ? 'btn-outline-danger' : 'btn-outline-secondary'}`}
                                                                onClick={() => cancelOrder(order.orderNumber, order.status)}
                                                                title="Cancel Order"
                                                                disabled={order.status !== "Pending"}
                                                            >
                                                                <i className="bi bi-x-lg"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            <div className="card-footer bg-white border-top-0 py-3">
                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                                    <div className="mb-2 mb-md-0">
                                        <select 
                                            className="form-select form-select-sm d-inline-block w-auto" 
                                            value={orderPerPage}
                                            onChange={(e) => setOrderPerPage(Number(e.target.value))}
                                        >
                                            <option value="5">5 per page</option>
                                            <option value="10">10 per page</option>
                                            <option value="20">20 per page</option>
                                            <option value="50">50 per page</option>
                                        </select>
                                    </div>
                                    <Pagination 
                                        totalPosts={orders.length} 
                                        postPerPage={orderPerPage} 
                                        setCurrentPage={setCurrentPage} 
                                        currentPage={currentPage} 
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
                        </div>
        </AdminLayout>
    );
};

export default AllOrders;
