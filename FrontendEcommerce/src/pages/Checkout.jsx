import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

export default function Checkout() {
  const { cartItems, subtotal, shipping, total, clearCart, cartCount, setCartOpen } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    shipping_name: user?.name || "",
    shipping_phone: "",
    shipping_address: "",
    shipping_city: "",
    shipping_notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setSubmitting(true);
    setError("");

    try {
      const order = await api.post("/orders", {
        items: cartItems.map((i) => ({ product_id: i.id, quantity: i.qty })),
        ...form,
      });
      clearCart();
      navigate("/orders", { state: { justPlaced: order.order_number } });
    } catch (err) {
      setError(err.message || "Could not place order.");
    } finally {
      setSubmitting(false);
    }
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Header cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
        <div style={{ maxWidth: 600, margin: "80px auto", textAlign: "center" }}>
          <h2>Your cart is empty</h2>
          <p style={{ color: "var(--muted)", marginTop: 8 }}>
            Add some products before checking out.
          </p>
          <button
            className="checkout-btn"
            style={{ marginTop: 20, width: 200 }}
            onClick={() => navigate("/products")}
          >
            Browse Products
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

      <section className="section" style={{ maxWidth: 900 }}>
        <div className="section-header">
          <h2 className="section-title">
            Check<span>out</span>
          </h2>
        </div>

        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          <form
            onSubmit={handleSubmit}
            style={{
              flex: "1 1 380px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: 24,
            }}
          >
            <h3 style={{ margin: 0 }}>Shipping details</h3>

            <label style={{ fontSize: 13, fontWeight: 600 }}>
              Full name
              <input
                required
                value={form.shipping_name}
                onChange={(e) => update("shipping_name", e.target.value)}
                style={inputStyle}
              />
            </label>

            <label style={{ fontSize: 13, fontWeight: 600 }}>
              Phone
              <input
                required
                value={form.shipping_phone}
                onChange={(e) => update("shipping_phone", e.target.value)}
                style={inputStyle}
              />
            </label>

            <label style={{ fontSize: 13, fontWeight: 600 }}>
              Address
              <input
                required
                value={form.shipping_address}
                onChange={(e) => update("shipping_address", e.target.value)}
                style={inputStyle}
              />
            </label>

            <label style={{ fontSize: 13, fontWeight: 600 }}>
              City
              <input
                required
                value={form.shipping_city}
                onChange={(e) => update("shipping_city", e.target.value)}
                style={inputStyle}
              />
            </label>

            <label style={{ fontSize: 13, fontWeight: 600 }}>
              Order notes (optional)
              <textarea
                value={form.shipping_notes}
                onChange={(e) => update("shipping_notes", e.target.value)}
                style={{ ...inputStyle, minHeight: 70, resize: "vertical" }}
              />
            </label>

            <div
              style={{
                fontSize: 12,
                color: "var(--muted)",
                background: "#f8fafc",
                padding: 10,
                borderRadius: 8,
              }}
            >
              💳 This is a mock checkout — no real payment is charged. Placing the order marks
              it as paid immediately for demo purposes.
            </div>

            {error && <p style={{ color: "#ef4444", fontSize: 13 }}>{error}</p>}

            <button className="checkout-btn" disabled={submitting} type="submit">
              {submitting ? "Placing order…" : `Place Order — $${total.toFixed(2)}`}
            </button>
          </form>

          <div
            style={{
              flex: "1 1 280px",
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: 24,
              height: "fit-content",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Order summary</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span>
                    {item.image} {item.name} × {item.qty}
                  </span>
                  <span>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-subtotal">
              <span>Shipping</span>
              <span style={{ color: shipping === 0 ? "#10b981" : undefined }}>
                {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="cart-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  marginTop: 6,
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid var(--border)",
  fontSize: 14,
  fontFamily: "inherit",
};
