import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/adminLayout";
import { useDispatch, useSelector } from "react-redux";
import { orderByCustomer, changeStatus } from "../../api/internal";
import toast from 'react-hot-toast';
import './order.css'
import { Link } from "react-router-dom";
const OrderList = () => {
    const id = useSelector(state => state.user._id);
    const [orders, setOrders] = useState([]);
    const [updateOrder, setUpdateOrder] = useState(0);
    const getOrders = async () => {
        const res = await orderByCustomer(id);
        // const res = await getUserOrders(id);
        setOrders(res.data.orders);
    }
   
    const cancelMyOrder = async (orderId, status) => {
      
        const check = window.confirm("Do you really want to cancel the Order?");
        if (check) {
            if (status !== "Pending") {
                toast.error("Your Order is " + status + "! Your can't cancel now.")
                return;
            }
            const data = {
                orderNo: orderId,
                status:"Canceled"
            }
            const res = await changeStatus(data);
            console.log(res);
            if (res?.data?.canceledOrder?.modifiedCount === 1) {
                setUpdateOrder(res.data.canceledOrder.modifiedCount);
                toast.error("Your Order has been cancel!");
                getOrders();
            } else {
              
                toast.error("Error While updating status!");
            }
        }
        }
    useEffect(() => {
        getOrders();
    }, [id, updateOrder]);


    
    return (<>
        <AdminLayout>
            <div className="col-9">
                <h2 className="p-2 text-center mt-2">Order List</h2>
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
                        {orders.map(order => (
                            <tr key={order.id} className={`status status-${order.status.toLowerCase() }` }>
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
                                    <Link to={`/admin/order/viewDetails/${order.orderNumber}`} className="btn btn-primary"  alt="View Detail" title="View Detail"><i className="bi bi-eye"></i></Link>
                                    <button className="btn btn-danger" onClick={() => cancelMyOrder(order.orderNumber,order.status) } alt="Cancel Order" title="Cancel Order"><i className="bi bi-x-lg"></i></button>
                                </td>
                            </tr>
                        ))} 
                    </tbody>
                    </table>
                    </div>
            </div>
        </AdminLayout>
    </>)
}
export default OrderList;