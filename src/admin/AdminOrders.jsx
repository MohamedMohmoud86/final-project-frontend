import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  
  const fetchOrders = async () => {
    try {
      
      const res = await axios.get("https://final-project-production-3b18.up.railway.app/api/orders/admin/all");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed with IP, trying localhost...", err);
      try {
      
        const resLocal = await axios.get("https://final-project-production-3b18.up.railway.app/api/orders");
        setOrders(resLocal.data);
      } catch (localErr) {
        console.error("All fetch attempts failed", localErr);
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`https://final-project-production-3b18.up.railway.app/api/orders/${orderId}/status`, { orderStatus: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders(); 
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="admin_orders_manager">
      <div className="admin_header_title">
        <h2>📋 Orders Management</h2>
        <span className="count_badge">Total Orders: {orders.length}</span>
      </div>

      <div className="admin_table_container">
        <table className="admin_table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Products Count</th>
              <th>Total Price</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                  No orders found in database.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <td className="order_id_cell">#{order._id ? order._id.substring(18) : "N/A"}</td>
                  <td>
                    <div className="customer_info">
                      <strong>{order.customerName || "Unknown"}</strong>
                      <span>{order.customerEmail || "No Email"}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: "600" }}>
                      {order.products ? order.products.length : 0} Items
                    </span>
                  </td>
                  <td className="price_cell">${order.totalPrice || order.total}</td>
                  <td>
                    <span className={`payment_badge ${(order.paymentStatus || "Pending").toLowerCase()}`}>
                      {order.paymentStatus || "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}