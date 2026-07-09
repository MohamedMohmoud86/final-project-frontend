import React, { useState, useEffect } from "react";
import axios from "axios";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, Label} from "recharts";

export default function AdminOverview() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("https://final-project-production-3b18.up.railway.app/api/admin/dashboard-stats");
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };
    fetchStats();
  }, []);

  if (!data) return <div style={{ padding: "20px", color: "#64748b" }}>Loading Dashboard Stats...</div>;

  const COLORS = ["#22c55e", "#f59e0b", "#3b82f6"];

  return (
    <div className="overview_wrapper">
     
      <div className="stats_cards_grid">
        <div className="stat_card">
          <div className="card_icon users_icon">👥</div>
          <div className="card_info">
            <span>Total Users</span>
            <h3>{data.stats.totalUsers.toLocaleString()}</h3>
          </div>
        </div>

        <div className="stat_card">
          <div className="card_icon orders_icon">🛍️</div>
          <div className="card_info">
            <span>Total Orders</span>
            <h3>{data.stats.totalOrders.toLocaleString()}</h3>
          </div>
        </div>

        <div className="stat_card">
          <div className="card_icon revenue_icon">💰</div>
          <div className="card_info">
            <span>Total Revenue</span>
            <h3>EGP {data.stats.totalRevenue.toLocaleString()}</h3>
          </div>
        </div>

        <div className="stat_card">
          <div className="card_icon products_icon">📦</div>
          <div className="card_info">
            <span>Total Products</span>
            <h3>{data.stats.totalProducts.toLocaleString()}</h3>
          </div>
        </div>
      </div>

    
      <div className="charts_section_grid">
      
        <div className="chart_card_box">
          <h4>Revenue Overview</h4>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <AreaChart data={data.chartData}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={0.1} fill="#3b82f6" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

       
   
<div className="chart_card_box">
  <h4>Orders by Status</h4>
  <div style={{ width: "100%", height: 250, display: "flex", justifyContent: "center" }}>
    <ResponsiveContainer>
      <PieChart>
        <Pie 
          data={data.statusDistribution} 
          cx="50%" 
          cy="50%" 
          innerRadius={65} 
          outerRadius={80} 
          paddingAngle={4} 
          dataKey="value"
        >
         
          <Label
            value={data.stats.totalOrders}
            position="centerBottom"
            dy={-2} 
            style={{ fontSize: "24px", fontWeight: "700", fill: "#0f172a", fontFamily: "sans-serif" }}
          />
          <Label
            value="Total"
            position="centerTop"
            dy={16} 
            style={{ fontSize: "12px", fontWeight: "500", fill: "#64748b", fontFamily: "sans-serif" }}
          />

          {data.statusDistribution.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>

      <div className="recent_orders_box_overview">
        <h4>Recent Orders</h4>
        <table className="admin_table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.recentOrders.map((order) => (
              <tr key={order._id}>
                <td className="order_id_cell">#{order._id.substring(18)}</td>
                <td><strong>{order.customerName || "Guest"}</strong></td>
                <td>EGP {order.totalPrice || order.total}</td>
                <td>
                  <span className={`payment_badge ${(order.paymentStatus || "Pending").toLowerCase()}`}>
                    {order.paymentStatus || "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}