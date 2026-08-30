import { useEffect, useState } from "react";
import api from "../../api/client";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  function load() {
    setLoading(true);
    const qs = statusFilter ? `?status=${statusFilter}` : "";
    api
      .get(`/admin/orders${qs}`)
      .then((data) => setOrders(data.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, [statusFilter]);

  async function updateStatus(id, status) {
    try {
      await api.put(`/admin/orders/${id}`, { status });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>Orders</h2>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)" }}
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {error && <p style={{ color: "#ef4444" }}>{error}</p>}

      {loading ? (
        <p>Loading…</p>
      ) : orders.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>No orders found.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {orders.map((o) => (
            <div key={o.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                <div>
                  <strong>{o.order_number}</strong>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>
                    {o.user?.name} · {o.user?.email} · {new Date(o.created_at).toLocaleString()}
                  </div>
                </div>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                  style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid var(--border)", height: "fit-content" }}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>
                Ship to: {o.shipping_name}, {o.shipping_address}, {o.shipping_city} ({o.shipping_phone})
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 8 }}>
                {o.items?.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span>{item.product_name} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, borderTop: "1px solid var(--border)", paddingTop: 8 }}>
                <span>Total</span>
                <span>${Number(o.total).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
