function Modal({ product, onClose, onAddToCart, isAdded }) {
  if (!product) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-image">{product.image}</div>
        <div className="modal-body">
          <div className="modal-category">{product.category}</div>
          <div className="modal-name">{product.name}</div>
          <div className="modal-rating">
            <Stars rating={product.rating} />
            <span>{product.rating} · {product.reviews} reviews</span>
          </div>
          <p className="modal-desc">
            Premium quality {product.name.toLowerCase()} crafted for everyday use.
            Designed with comfort and style in mind, perfect for any occasion.
          </p>
          <div className="modal-price-row">
            <span className="modal-price">${product.price}</span>
            {product.oldPrice && <span className="old-price">${product.oldPrice}</span>}
          </div>
          <div className="modal-actions">
            <button
              className="modal-add-btn"
              style={isAdded ? { background: "#10b981" } : {}}
              onClick={() => onAddToCart(product)}
            >
              {isAdded ? "✓ Added to Cart" : "Add to Cart"}
            </button>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;