function CardsGrid({ onView, onAddToCart, cartItems }) {
  const inCart = (id) => cartItems.some((i) => i.id === id);
  return (
    <section className="section">
      <div className="section-header">
        <h2 className="section-title">Featured <span>Products</span></h2>
        <button className="see-all">See All →</button>
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