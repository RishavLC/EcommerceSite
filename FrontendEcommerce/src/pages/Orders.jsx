import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../api/client";
import { useCart } from "../context/CartContext";

const STATUS_COLORS = {
  pending: "#f59e0b",
  processing: "#0ea5e9",
  shipped: "#6366f1",
  delivered: "#10b981",
  cancelled: "#ef4444",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { cartCount, setCartOpen } = useCart();
  const location = useLocation();
  const justPlaced = location.state?.justPlaced;

  useEffect(() => {
    api
      .get("/orders")
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">
            My <span>Orders</span>
          </h2>
        </div>

        {justPlaced && (
          <div
            style={{
              background: "#ecfdf5",
              border: "1px solid #10b981",
              color: "#065f46",
              padding: 14,
              borderRadius: 10,
              marginBottom: 20,
              fontWeight: 600,
            }}
          >
            ✅ Order {justPlaced} placed successfully!
          </div>
        )}

        {loading && <p>Loading your orders…</p>}
        {error && <p style={{ color: "#ef4444" }}>{error}</p>}
        {!loading && !error && orders.length === 0 && (
          <p style={{ color: "var(--muted)" }}>You haven't placed any orders yet.</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                background: "#fff",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <div>
                  <strong>{order.order_number}</strong>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>
                    {new Date(order.created_at).toLocaleString()}
                  </div>
                </div>
                <span
                  style={{
                    alignSelf: "flex-start",
                    background: (STATUS_COLORS[order.status] || "#64748b") + "20",
                    color: STATUS_COLORS[order.status] || "#64748b",
                    fontWeight: 700,
                    fontSize: 12,
                    padding: "4px 12px",
                    borderRadius: 20,
                    textTransform: "capitalize",
                  }}
                >
                  {order.status}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}
                  >
                    <span>
                      {item.product_name} × {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid var(--border)",
                  paddingTop: 12,
                  fontWeight: 700,
                }}
              >
                <span>Total</span>
                <span>${Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
