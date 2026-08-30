import Stars from "../Stars";

function ProductCard({ product, onView, onAddToCart, isAdded }) {
  const badgeClass =
    product.badge === "New" ? "new" : product.badge === "Top" ? "top" : "";

  const price = Number(product.price);
  const oldPrice = product.old_price ? Number(product.old_price) : null;
  const rating = Number(product.rating || 0);
  const reviews = product.reviews_count ?? product.reviews ?? 0;
  const category = product.category?.name || product.category || "";

  return (
    <div className="card">
      <div className="card-image" onClick={() => onView(product)}>
        {product.badge && (
          <span className={`card-badge ${badgeClass}`}>{product.badge}</span>
        )}
        {product.image}
      </div>

      <div className="card-body">
        <div className="card-category">{category}</div>

        <div className="card-name" onClick={() => onView(product)}>
          {product.name}
        </div>

        <div className="card-rating">
          <Stars rating={rating} />
          <span>({reviews})</span>
        </div>

        <div className="card-footer">
          <div className="price-group">
            <span className="price">${price.toFixed(2)}</span>
            {oldPrice && <span className="old-price">${oldPrice.toFixed(2)}</span>}
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
