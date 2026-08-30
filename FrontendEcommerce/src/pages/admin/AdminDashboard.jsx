import { useEffect, useState } from "react";
import api from "../../api/client";

const CARD_STYLE = {
  background: "#fff",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  padding: 20,
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p style={{ color: "#ef4444" }}>{error}</p>;
  if (!stats) return <p>Loading dashboard…</p>;

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Dashboard</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <div style={CARD_STYLE}>
          <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>PRODUCTS</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{stats.products_count}</div>
        </div>
        <div style={CARD_STYLE}>
          <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>ORDERS</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{stats.orders_count}</div>
        </div>
        <div style={CARD_STYLE}>
          <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>CUSTOMERS</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{stats.users_count}</div>
        </div>
        <div style={CARD_STYLE}>
          <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>REVENUE</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>${stats.revenue_total.toFixed(2)}</div>
        </div>
      </div>

      <div style={CARD_STYLE}>
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>Recent Orders</h3>
        {stats.recent_orders.length === 0 && <p style={{ color: "var(--muted)" }}>No orders yet.</p>}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
              <th style={{ padding: "8px 4px" }}>Order</th>
              <th style={{ padding: "8px 4px" }}>Customer</th>
              <th style={{ padding: "8px 4px" }}>Status</th>
              <th style={{ padding: "8px 4px" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {stats.recent_orders.map((o) => (
              <tr key={o.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "8px 4px" }}>{o.order_number}</td>
                <td style={{ padding: "8px 4px" }}>{o.user?.name}</td>
                <td style={{ padding: "8px 4px", textTransform: "capitalize" }}>{o.status}</td>
                <td style={{ padding: "8px 4px" }}>${Number(o.total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
