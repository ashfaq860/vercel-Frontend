// components/cart/CartSummary.jsx
import React from "react";

const CartSummary = ({ total, shippingCost, canCheckout }) => {
    return (
        <div className="col-5">
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <td className="text-end"><strong>Sub-Total:</strong></td>
                        <td className="text-end">Rs. {total}</td>
                    </tr>
                    <tr>
                        <td className="text-end"><strong>Flat Shipping Rate:</strong></td>
                        <td className="text-end">Rs. {shippingCost}</td>
                    </tr>
                    <tr>
                        <td className="text-end"><strong>Total:</strong></td>
                        <td className="text-end">Rs. {total + shippingCost}</td>
                    </tr>
                </tbody>
            </table>
            {!canCheckout && (
                <p className="text-danger small text-end">❌ Please correct quantities before checkout.</p>
            )}
        </div>
    );
};

export default CartSummary;
