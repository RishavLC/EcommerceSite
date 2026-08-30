import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const linkStyle = ({ isActive }) => ({
  display: "block",
  padding: "10px 16px",
  borderRadius: 8,
  color: isActive ? "#fff" : "#94a3b8",
  background: isActive ? "var(--accent)" : "transparent",
  fontWeight: 600,
  fontSize: 14,
  marginBottom: 4,
});

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 220, background: "var(--dark)", padding: 20, flexShrink: 0 }}>
        <Link to="/" style={{ display: "block", color: "#fff", fontWeight: 800, fontSize: 20, marginBottom: 24 }}>
          shop<span style={{ color: "var(--accent)" }}>NEST</span>
          <div style={{ fontSize: 11, color: "#64748b", fontWeight: 500 }}>Admin Panel</div>
        </Link>

        <nav>
          <NavLink to="/admin" end style={linkStyle}>📊 Dashboard</NavLink>
          <NavLink to="/admin/products" style={linkStyle}>📦 Products</NavLink>
          <NavLink to="/admin/categories" style={linkStyle}>🏷️ Categories</NavLink>
          <NavLink to="/admin/orders" style={linkStyle}>🧾 Orders</NavLink>
        </nav>

        <div style={{ marginTop: 40, borderTop: "1px solid #1e293b", paddingTop: 16 }}>
          <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8 }}>{user?.name}</div>
          <button
            onClick={logout}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              background: "#1e293b",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, background: "var(--bg)", padding: 32 }}>
        <Outlet />
      </main>
    </div>
  );
}
