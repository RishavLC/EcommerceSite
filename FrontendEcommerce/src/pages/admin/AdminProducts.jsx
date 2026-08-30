import { useEffect, useState } from "react";
import api from "../../api/client";

const emptyForm = {
  name: "",
  category_id: "",
  price: "",
  old_price: "",
  stock: "",
  image: "🛍️",
  badge: "",
  description: "",
  is_active: true,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // product being edited, or 'new'
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    Promise.all([api.get("/admin/products?per_page=100"), api.get("/categories")])
      .then(([p, c]) => {
        setProducts(p.data || []);
        setCategories(c || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function startCreate() {
    setForm(emptyForm);
    setEditing("new");
  }

  function startEdit(product) {
    setForm({
      name: product.name,
      category_id: product.category_id || "",
      price: product.price,
      old_price: product.old_price || "",
      stock: product.stock,
      image: product.image || "",
      badge: product.badge || "",
      description: product.description || "",
      is_active: product.is_active,
    });
    setEditing(product.id);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        category_id: form.category_id || null,
        old_price: form.old_price || null,
        price: Number(form.price),
        stock: Number(form.stock),
      };
      if (editing === "new") {
        await api.post("/admin/products", payload);
      } else {
        await api.put(`/admin/products/${editing}`, payload);
      }
      setEditing(null);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    try {
      await api.del(`/admin/products/${id}`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>Products</h2>
        <button className="checkout-btn" style={{ width: "auto", padding: "10px 20px" }} onClick={startCreate}>
          + New Product
        </button>
      </div>

      {error && <p style={{ color: "#ef4444" }}>{error}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left", background: "#f8fafc" }}>
                <th style={{ padding: 12 }}>Product</th>
                <th style={{ padding: 12 }}>Category</th>
                <th style={{ padding: 12 }}>Price</th>
                <th style={{ padding: 12 }}>Stock</th>
                <th style={{ padding: 12 }}>Active</th>
                <th style={{ padding: 12 }}></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: 12 }}>{p.image} {p.name}</td>
                  <td style={{ padding: 12 }}>{p.category?.name || "—"}</td>
                  <td style={{ padding: 12 }}>${Number(p.price).toFixed(2)}</td>
                  <td style={{ padding: 12 }}>{p.stock}</td>
                  <td style={{ padding: 12 }}>{p.is_active ? "✅" : "🚫"}</td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                    <button onClick={() => startEdit(p)} style={{ marginRight: 8, background: "#e2e8f0", padding: "6px 10px", borderRadius: 6 }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p.id)} style={{ background: "#fee2e2", color: "#ef4444", padding: "6px 10px", borderRadius: 6 }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSave}
            style={{ width: "min(520px, 92%)", background: "#fff", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 12, maxHeight: "85vh", overflowY: "auto" }}
          >
            <h3 style={{ margin: 0 }}>{editing === "new" ? "New Product" : "Edit Product"}</h3>

            <label style={{ fontSize: 13, fontWeight: 600 }}>
              Name
              <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} style={inputStyle} />
            </label>

            <label style={{ fontSize: 13, fontWeight: 600 }}>
              Category
              <select value={form.category_id} onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))} style={inputStyle}>
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>

            <div style={{ display: "flex", gap: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>
                Price ($)
                <input required type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} style={inputStyle} />
              </label>
              <label style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>
                Old price ($)
                <input type="number" step="0.01" min="0" value={form.old_price} onChange={(e) => setForm((f) => ({ ...f, old_price: e.target.value }))} style={inputStyle} />
              </label>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>
                Stock
                <input required type="number" min="0" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} style={inputStyle} />
              </label>
              <label style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>
                Emoji / image
                <input value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} style={inputStyle} />
              </label>
            </div>

            <label style={{ fontSize: 13, fontWeight: 600 }}>
              Badge (optional: New, Top, Sale)
              <input value={form.badge} onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))} style={inputStyle} />
            </label>

            <label style={{ fontSize: 13, fontWeight: 600 }}>
              Description
              <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} style={{ ...inputStyle, minHeight: 70 }} />
            </label>

            <label style={{ fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} />
              Active (visible on storefront)
            </label>

            {error && <p style={{ color: "#ef4444", fontSize: 13 }}>{error}</p>}

            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button type="submit" disabled={saving} className="checkout-btn" style={{ flex: 1 }}>
                {saving ? "Saving…" : "Save"}
              </button>
              <button type="button" onClick={() => setEditing(null)} style={{ padding: "12px 16px", borderRadius: 10, border: "1px solid var(--border)", background: "#fff" }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
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
