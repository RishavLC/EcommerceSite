import { useEffect, useState } from "react";
import api from "../../api/client";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api
      .get("/admin/categories")
      .then(setCategories)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await api.post("/admin/categories", { name });
      setName("");
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdate(id) {
    try {
      await api.put(`/admin/categories/${id}`, { name: editingName });
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this category? Products in it will become uncategorized.")) return;
    try {
      await api.del(`/admin/categories/${id}`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Categories</h2>

      <form onSubmit={handleCreate} style={{ display: "flex", gap: 10, marginBottom: 24, maxWidth: 420 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)" }}
        />
        <button className="checkout-btn" style={{ width: "auto", padding: "10px 20px" }}>Add</button>
      </form>

      {error && <p style={{ color: "#ef4444" }}>{error}</p>}

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 500 }}>
          {categories.map((c) => (
            <div
              key={c.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#fff",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "10px 16px",
              }}
            >
              {editingId === c.id ? (
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  style={{ flex: 1, marginRight: 10, padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)" }}
                />
              ) : (
                <span>
                  {c.name} <span style={{ color: "var(--muted)", fontSize: 12 }}>({c.products_count} products)</span>
                </span>
              )}

              <div style={{ display: "flex", gap: 6 }}>
                {editingId === c.id ? (
                  <button onClick={() => handleUpdate(c.id)} style={{ background: "#10b981", color: "#fff", padding: "6px 10px", borderRadius: 6 }}>
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(c.id);
                      setEditingName(c.name);
                    }}
                    style={{ background: "#e2e8f0", padding: "6px 10px", borderRadius: 6 }}
                  >
                    Edit
                  </button>
                )}
                <button onClick={() => handleDelete(c.id)} style={{ background: "#fee2e2", color: "#ef4444", padding: "6px 10px", borderRadius: 6 }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
