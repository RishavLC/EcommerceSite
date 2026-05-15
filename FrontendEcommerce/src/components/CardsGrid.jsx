import ProductCard from "./ProductCard";

const PRODUCTS = [
  {
    id: 1,
    name: "Nike Sneakers",
    category: "Footwear",
    price: 120,
    oldPrice: 150,
    rating: 5,
    reviews: 120,
    badge: "Top",
    image: "👟",
  },
  {
    id: 2,
    name: "Smart Watch",
    category: "Electronics",
    price: 80,
    oldPrice: 100,
    rating: 4,
    reviews: 95,
    badge: "New",
    image: "⌚",
  },
  {
    id: 3,
    name: "Headphones",
    category: "Audio",
    price: 60,
    oldPrice: 90,
    rating: 4,
    reviews: 88,
    badge: "",
    image: "🎧",
  },
];

function CardsGrid({
  onView,
  onAddToCart,
  cartItems,
}) {
  const inCart = (id) =>
    cartItems.some((i) => i.id === id);

  return (
    <section className="section">
      <div className="section-header">
        <h2 className="section-title">
          Featured <span>Products</span>
        </h2>

        <button className="see-all">
          See All →
        </button>
      </div>

      <div className="cards-grid">
        {PRODUCTS.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onView={onView}
            onAddToCart={onAddToCart}
            isAdded={inCart(p.id)}
          />
        ))}
      </div>
    </section>
  );
}

export default CardsGrid;