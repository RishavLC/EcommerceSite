function ProductCard({ product, onView, onAddToCart, isAdded }) {
  const badgeClass = product.badge === "New" ? "new" : product.badge === "Top" ? "top" : "";

  return (
    <div className="card">
      <div className="card-image" onClick={() => onView(product)}>
        {product.badge && (
          <span className={`card-badge ${badgeClass}`}>{product.badge}</span>
        )}
        {product.image}
      </div>
      <div className="card-body">
        <div className="card-category">{product.category}</div>
        <div className="card-name" onClick={() => onView(product)}>{product.name}</div>
        <div className="card-rating">
          <Stars rating={product.rating} />
          <span>({product.reviews})</span>
        </div>
        <div className="card-footer">
          <div className="price-group">
            <span className="price">${product.price}</span>
            {product.oldPrice && <span className="old-price">${product.oldPrice}</span>}
          </div>
          <button
            className={`add-btn ${isAdded ? "added" : ""}`}
            onClick={() => onAddToCart(product)}
          >
            {isAdded ? "✓ Added" : "+ Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProductCard;