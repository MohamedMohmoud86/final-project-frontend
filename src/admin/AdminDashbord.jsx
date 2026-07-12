import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import AdminOverview from "./AdminOverview";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminUsers from "./AdminUsers"; 
import AdminContact from "./AdminContact"; 
import "./admin.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const savedUser = sessionStorage.getItem("user"); 
    
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      
      
      if (parsedUser.role === "admin" || parsedUser.email === "novastore156@gmail.com") {
        setIsAdmin(true);
      } else {
        navigate("/"); 
      }
    } else {
      navigate("/login"); 
    }
    setLoading(false);
  }, [navigate]);

 
  if (loading) return <div className="admin_loading">Loading Admin Panel...</div>;
  if (!isAdmin) return null;

  return (
    <div className="admin_dashboard_wrapper">
      <div className="admin_sidebar">
        <div className="sidebar_logo">
          <h2>Admin Panel</h2>
          <p>Mohamed Mahmoud</p> 
        </div>
        <ul className="sidebar_menu">
          <li 
            className={activeTab === "overview" ? "active" : ""} 
            onClick={() => setActiveTab("overview")}
          >
            📊 Overview
          </li>
          <li 
            className={activeTab === "products" ? "active" : ""} 
            onClick={() => setActiveTab("products")} 
          >
            📦 Products
          </li>
          <li 
            className={activeTab === "orders" ? "active" : ""} 
            onClick={() => setActiveTab("orders")}
          >
            📋 Orders
          </li>
          <li 
            className={activeTab === "users" ? "active" : ""} 
            onClick={() => setActiveTab("users")}
          >
            👥 Users
          </li>
          <li 
            className={activeTab === "contact" ? "active" : ""} 
            onClick={() => setActiveTab("contact")}
          >
            📩 Contact Messages
          </li>
        </ul>
      </div>

      <div className="admin_main_content">
        {activeTab === "overview" && (
          <div className="admin_blank_state">
            <h3>📊 Overview Statistics</h3>
          </div>
        )}

        {activeTab === "overview" && <AdminOverview />}
        {activeTab === "products" && <AdminProducts />}
        {activeTab === "orders" && <AdminOrders />}
        {activeTab === "users" && <AdminUsers />}
        {activeTab === "contact" && <AdminContact />}
      </div>
    </div>
  );
}