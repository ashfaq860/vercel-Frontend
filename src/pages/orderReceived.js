import Layout from "../components/layout/layout";
import { Helmet } from 'react-helmet-async';

import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { orderById} from "../api/internal";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import toast from "react-hot-toast";
const OrderReceived = () => {
    const navigate = useNavigate();
    const { OId } = useParams();
    const printRef = useRef();

    const [order, setOrder] = useState({});
    const [items, setItems] = useState([]);
    
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [province, setProvince] = useState("");
    const [city, setCity] = useState("");
    const [email, setEmail] = useState("");

    const receivedOrder = async () => {
        const { data } = await orderById(OId);
       console.log(data.order.items);
        setOrder(data?.order);
        setItems(data.order.items);
        setName(data.order.shippingAddress.name);
        setPhone(data.order.shippingAddress.phone);
        setEmail(data.order.shippingAddress.email);
        setAddress(data.order.shippingAddress.address);
        setProvince(data.order.shippingAddress.province);
        setCity(data.order.shippingAddress.city);
    };

    useEffect(() => {
        receivedOrder();
       // console.log(items);
    }, [OId]);
   

  
    

    const handleExportPDF = () => {
        const element = printRef.current;

        const opt = {
            margin: 0.5,
            filename: `Invoice-${order.orderNumber || "order"}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
            pagebreak: { mode: ['avoid-all'] },
        };

        html2pdf().set(opt).from(element).save().then(() => {
            window.print();
        });
    };
    const cellHeaderStyle = {
        border: "1px solid #333",
        padding: "8px",
        backgroundColor: "#f1f1f1",
        textAlign: "left"
    };

    const cellBodyStyle = {
        border: "1px solid #333",
        padding: "8px",
        textAlign: "left",
        verticalAlign: "top"
    };
    return (
        <Layout>
            <Helmet>
                <title>Cart View | Mian Motorcycle Parts Raiwind</title>
            </Helmet>

            <div className="container">
                <h1 className="alert alert-success mt-3 text-center" role="alert">
                    Thank You! Your order has been received. <small>{order.paymentMethod !== "CashOnDelivery" && (<>JassCash&EasyPaisa# {process.env.REACT_APP_PHONE}</>)}</small>
                </h1>

                {/* Invoice Section */}
                <div className="row border p-4 shadow-sm rounded print-area" ref={printRef} style={{ backgroundColor: '#fff' }}>
                    <div className="text-center mb-3">
                        <img src="/logo.jpg" alt="Logo" style={{ height: "60px" }} />
                        <h3 className="mt-2 fw-bold text-uppercase text-primary">Mian Motorcycle Parts</h3>
                        <h5 className="text-muted">Official Invoice</h5>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-4">
                            <h6><strong>Customer Address</strong></h6>
                            <p><strong>Name:</strong> {name}</p>
                            <p><strong>Phone:</strong> {phone}</p>
                            <p><strong>Email:</strong> {email}</p>
                            <p><strong>Province:</strong> {province}</p>
                            <p><strong>City:</strong> {city}</p>
                            <p><strong>Address:</strong> {address}</p>
                        </div>

                        <div className="col-md-4">
                            <h6><strong>Order Details</strong></h6>
                            <p><strong>Order Number:</strong> {order.orderNumber}</p>
                            <p><strong>Date:</strong> {order.createdAt}</p>
                            <p><strong>Total:</strong> Rs {order.total}</p>
                            <p><strong>Payment:</strong> {order.paymentMethod}</p>
                        </div>
                    </div>

                    <div className="col-12 mt-3">
                        <h5 className="text-decoration-underline">Items Detail</h5>
                        <table className="table table-bordered table-hover" style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead className="thead-dark">
                                <tr>
                                    <th style={cellHeaderStyle}>Part Name</th>
                                    <th style={cellHeaderStyle}>Model</th>
                                    <th style={cellHeaderStyle}>Qty</th>
                                    <th style={cellHeaderStyle}>Unit Price</th>
                                    <th style={cellHeaderStyle}>Shipping Rate</th>
                                    <th style={cellHeaderStyle}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items?.map((p, i) => (
                                    <tr key={i}>
                                        <td style={cellBodyStyle}>{p?.name} <small>{p?.urduName}</small></td>
                                        <td style={cellBodyStyle}>{p?.manufacturer}</td>
                                        <td style={cellBodyStyle}>{p?.qty}</td>
                                        <td style={cellBodyStyle}>Rs {p?.price}</td>
                                        <td style={cellBodyStyle}>Rs {p?.shippingCost}</td>
                                        <td style={cellBodyStyle}>Rs {p?.price * p?.qty}</td>
                                    </tr>
                                ))}

                                {/* 🔽 Summary Rows */}
                                <tr>
                                    <td colSpan="5" style={{ ...cellHeaderStyle, textAlign: 'right' }}><strong>Subtotal</strong></td>
                                    <td style={cellBodyStyle}>
                                        Rs {order?.subTotal?.toFixed(0)}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="5" style={{ ...cellHeaderStyle, textAlign: 'right' }}><strong>Total Shipping</strong></td>
                                    <td style={cellBodyStyle}>
                                        Rs {order?.shippingCost?.toFixed(0)}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="5" style={{ ...cellHeaderStyle, textAlign: 'right' }}><strong>Grand Total</strong></td>
                                    <td style={cellBodyStyle}>
                                        Rs { Number(order?.subTotal)+Number(order?.shippingCost)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="col-12 mt-4">
                        <h6>Customer Notes / Delivery Time</h6>
                        <p>{order.notes || "We will contact you shortly!"}</p>
                    </div>

                    <div className="col-12 text-end mt-4">
                        <img src="/stamp.png" alt="Company Stamp" style={{ width: '100px', opacity: 0.6 }} />
                    </div>
                </div>

                {/* Actions */}
                <div className="text-end mt-4">
                    <button className="btn btn-primary me-2" onClick={handleExportPDF}>
                        📄 Export + Print
                    </button>
                    <Link to="/" className="btn btn-secondary">
                        🏠 Continue Shopping
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default OrderReceived;
