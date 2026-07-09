import React, { useState, useEffect, useContext } from 'react';
import './Orders.css';
import { FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast"; 
import { CartContext } from '../../component/context/CartContext'; 

function Orders() {
  const [orders, setOrders] = useState([]);
  const location = useLocation();
  const { clearCart } = useContext(CartContext);

 
  const fetchOrders = async () => {
    try {
     
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");
      
      const userId = currentUser.uid || currentUser.id || currentUser._id;

      if (!userId) {
        console.error("No User ID found");
        return;
      }

      
      const res = await axios.get(`https://final-project-production-3b18.up.railway.app/api/orders?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search); 
    const paymentSuccess = queryParams.get("success");

    if (paymentSuccess === "true") {
      toast.success("Payment Succeeded! Your order is now paid.");

      localStorage.removeItem("cartItems");
      localStorage.setItem("cartItems", JSON.stringify([]));

      if (clearCart) {
        clearCart(); 
      }

      setOrders(prevOrders => {
        if (prevOrders.length > 0 && prevOrders[0].paymentStatus !== "paid") {
          const updatedOrders = [...prevOrders];
          updatedOrders[0] = { 
            ...updatedOrders[0], 
            paymentStatus: "paid", 
            status: "Confirmed" 
          };
          return updatedOrders;
        }
        return prevOrders;
      });

      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const removeOrder = async (id) => {
    try {
      await axios.delete(`https://final-project-production-3b18.up.railway.app/api/orders/${id}`);
      
      const updatedOrders = orders.filter(order => (order._id || order.id) !== id);
      setOrders(updatedOrders);
    
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      
      toast.success("Order deleted successfully!");
    } catch (err) {
      console.error("Failed to delete order from server:", err);
      toast.error("Could not delete order. Try again.");
    }
  };

  const getStatusClass = (status) => {
    if (!status) return 'pending';
    const currentStatus = status.toLowerCase(); 
    if (currentStatus === 'paid' || currentStatus === 'confirmed') return 'paid';
    if (currentStatus === 'cancelled' || currentStatus === 'payment cancelled') return 'cancelled';
    return 'pending';
  };

  return (
    <div className='orders_page'>
      <div className='container'>
        <h1>My Orders</h1>

        <div className='orders_grid'>
          {orders && orders.length > 0 ? (
            orders.map((order) => {
              const uniqueKey = order._id || order.id;
              
              const orderId = order.orderNumber || `ORD-${String(uniqueKey).substring(0, 8).toUpperCase()}`;
              const orderStatus = order.status || "Pending";
              const paymentStatus = order.paymentStatus || "Pending";
              const orderTotal = order.totalPrice || order.total || order.amount || 0;
              
              const itemsCount = order.items?.length || order.products?.length || 1;

              const orderDate = order.createdAt 
                ? new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'numeric', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  }) 
                : "Just now";

              return (
                <div className='order_card' key={uniqueKey}>
                  <div className='top_order'>
                    <h3>{orderId}</h3>
                    <div className="action_zone">
                      <span className={`status_badge ${getStatusClass(orderStatus)}`}>
                        {orderStatus}
                      </span>
                      <button className='delete_order' onClick={() => removeOrder(uniqueKey)}>
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>

                  <div className="order_details">
                    <p className="order_date">{orderDate}</p>
                    <p className="order_items_count">{itemsCount} item(s)</p>
                  </div>

                  <div className="order_price_section">
                    <h2>${Number(orderTotal).toFixed(2)}</h2>
                  </div>

                  <div className='order_footer'>
                    <span className={`payment_badge ${getStatusClass(paymentStatus)}`}>
                      Payment {paymentStatus}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="no_orders">No Orders Yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Orders;