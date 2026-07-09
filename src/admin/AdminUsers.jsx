import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://final-project-production-3b18.up.railway.app/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin_orders_manager"> 
      <div className="admin_header_title">
        <h2>👥 Users Management</h2>
        <span className="count_badge">Total Users: {users.length}</span>
      </div>

      <div className="admin_table_container">
        <table className="admin_table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                  No registered users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td className="order_id_cell">#{user._id ? user._id.substring(18) : "N/A"}</td>
                  <td><strong>{user.name}</strong></td>
                  <td>{user.email}</td>
                  <td>
                    
                    <span className={`payment_badge ${user.isVerified ? "paid" : "pending"}`}>
                      {user.isVerified ? "Verified ✅" : "Unverified ⏳"}
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