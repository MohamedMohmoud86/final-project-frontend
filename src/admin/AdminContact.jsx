import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaTrashAlt, FaEnvelope } from "react-icons/fa";

export default function AdminContact() {
  const [messages, setMessages] = useState([]);


  const fetchMessages = async () => {
    try {
      const res = await axios.get("https://final-project-production-3b18.up.railway.app/api/admin/contact");
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);


  const handleDeleteMessage = async (id) => {
    try {
      const res = await fetch(`https://final-project-production-3b18.up.railway.app/api/admin/contact/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessages(prev => prev.filter(msg => msg._id !== id));
        toast.success("Message deleted successfully! 🗑️");
      } else {
        toast.error("Failed to delete message");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="admin_products_manager"> 
      <div className="admin_header_title">
        <h2>📩 Contact Us Messages</h2>
        <span className="count_badge">Total Messages: {messages.length}</span>
      </div>

      <div className="table_section" style={{ marginTop: "20px" }}>
        <h3>Inbox Messages</h3>
        <div className="admin_table_container">
          <table className="admin_table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <tr key={msg._id}>
                    <td style={{ fontWeight: "bold" }}>{msg.name}</td>
                    <td><a href={`mailto:${msg.email}`}>{msg.email}</a></td>
                    <td><span className="category_badge">{msg.subject || "No Subject"}</span></td>
                    <td style={{ maxWidth: "300px", whiteSpace: "normal", textAlign: "left" }}>
                      {msg.message}
                    </td>
                    <td>
                      <button 
                        onClick={() => handleDeleteMessage(msg._id)} 
                        className="delete_action_btn"
                        style={{ background: "#dc3545", padding: "6px 10px" }}
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                    📬 No messages found in your inbox!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}