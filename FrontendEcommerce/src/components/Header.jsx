import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

function Header({ cartCount, onCartOpen }) {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  useEffect(() => {
    api.get("/categories", { auth: false }).then(setCategories).catch(() => {});
  }, []);

  function goToProducts(overrides = {}) {
    const params = new URLSearchParams();
    const s = overrides.search ?? search;
    const c = overrides.category ?? category;
    if (s) params.set("search", s);
    if (c && c !== "all") params.set("category", c);
    navigate(`/products${params.toString() ? "?" + params.toString() : ""}`);
  }

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          shop<span>NEST</span>
        </div>
        <nav className="nav">
          <a href="/">Home</a>
          <a href="/products">Products</a>
          <a href="/products?sort=price_asc">Sale</a>
          {isAuthenticated && <a href="/orders">Orders</a>}
          {isAdmin && <a href="/admin">Admin</a>}
        </nav>
        <div className="header-right">
          <select
            name="category"
            className="category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              goToProducts({ category: e.target.value });
            }}
          >
            <option className="category-opt" value="all">All</option>
            {categories.map((c) => (
              <option className="category-opt" key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <input
            className="search-bar"
            placeholder="🔍  Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") goToProducts();
            }}
          />
          <button className="icon-btn" onClick={onCartOpen}>
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {isAuthenticated ? (
            <div style={{ position: "relative" }}>
              <button
                className="icon-btn"
                title={user?.name}
                onClick={() => {
                  if (confirm("Log out?")) logout();
                }}
              >
                👤
              </button>
            </div>
          ) : (
            <button className="icon-btn" onClick={() => navigate("/login")}>👤</button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
