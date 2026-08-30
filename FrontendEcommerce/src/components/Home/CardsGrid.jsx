import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import api from "../../api/client";

function CardsGrid({ onView, onAddToCart, cartItems }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/products?sort=rating&per_page=8", { auth: false })
      .then((data) => setProducts(data.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const inCart = (id) => cartItems.some((i) => i.id === id);

  return (
    <section className="section">
      <div className="section-header">
        <h2 className="section-title">
          Featured <span>Products</span>
        </h2>

        <button className="see-all" onClick={() => navigate("/products")}>
          See All →
        </button>
      </div>

      {loading ? (
        <p>Loading featured products…</p>
      ) : (
        <div className="cards-grid">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onView={onView}
              onAddToCart={onAddToCart}
              isAdded={inCart(p.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default CardsGrid;
