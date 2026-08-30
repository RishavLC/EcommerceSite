import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";
import ProductCard from "../components/Home/ProductCard";
import Modal from "../components/Home/Modal";
import CartDrawer from "../components/Home/CartDrawer";
import { useCart } from "../context/CartContext";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalProduct, setModalProduct] = useState(null);

  const { cartItems, addToCart, changeQty, removeFromCart, cartOpen, setCartOpen, cartCount } =
    useCart();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "newest";
  const page = Number(searchParams.get("page") || 1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category && category !== "all") params.set("category", category);
    if (sort) params.set("sort", sort);
    params.set("page", page);
    params.set("per_page", 12);

    api
      .get(`/products?${params.toString()}`, { auth: false })
      .then((data) => {
        if (cancelled) return;
        setProducts(data.data || []);
        setMeta(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [search, category, sort, page]);

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.delete("page");
    setSearchParams(next);
  }

  function goToPage(p) {
    const next = new URLSearchParams(searchParams);
    next.set("page", p);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const inCart = (id) => cartItems.some((i) => i.id === id);

  return (
    <>
      <Header cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">
            All <span>Products</span>
          </h2>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
          <input
            className="search-bar"
            style={{ width: 240, color: "#0f172a", background: "#fff", border: "1px solid #e2e8f0" }}
            placeholder="🔍  Search products…"
            defaultValue={search}
            onKeyDown={(e) => {
              if (e.key === "Enter") updateParam("search", e.target.value);
            }}
          />

          <select
            className="category-opt"
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0" }}
            value={category}
            onChange={(e) => updateParam("category", e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="footwear">Footwear</option>
            <option value="beauty">Beauty</option>
            <option value="sports">Sports</option>
            <option value="books">Books</option>
            <option value="audio">Audio</option>
          </select>

          <select
            className="category-opt"
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0" }}
            value={sort}
            onChange={(e) => updateParam("sort", e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {loading && <p>Loading products…</p>}
        {error && <p style={{ color: "#ef4444" }}>{error}</p>}

        {!loading && !error && products.length === 0 && (
          <p style={{ color: "var(--muted)" }}>No products found. Try a different search or category.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <div className="cards-grid">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onView={() => setModalProduct(p)}
                  onAddToCart={addToCart}
                  isAdded={inCart(p.id)}
                />
              ))}
            </div>

            {meta && meta.last_page > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32 }}>
                {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: p === meta.current_page ? "var(--dark)" : "#fff",
                      color: p === meta.current_page ? "#fff" : "var(--text)",
                      fontWeight: 700,
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <Footer />

      {modalProduct && (
        <Modal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          onAddToCart={(product) => {
            addToCart(product);
            setModalProduct(null);
          }}
          isAdded={inCart(modalProduct.id)}
        />
      )}

      {cartOpen && (
        <CartDrawer
          cartItems={cartItems}
          onClose={() => setCartOpen(false)}
          onQtyChange={changeQty}
          onRemove={removeFromCart}
          onCheckout={() => {
            setCartOpen(false);
            navigate("/checkout");
          }}
        />
      )}

      <BackToTop />
    </>
  );
}

export default Products;
