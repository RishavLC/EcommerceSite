function Modal({ product, onClose, onAddToCart, isAdded }) {
  if (!product) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(800px, 92%)",
          background: "white",
          borderRadius: "18px",
          display: "flex",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        {/* LEFT SIDE */}
        <div
          style={{
            flex: 1,
            background: "#f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "90px",
            padding: "30px",
          }}
        >
          {product.image}
        </div>

        {/* RIGHT SIDE */}
        <div
          style={{
            flex: 1,
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {product.category}
          </span>

          <h2 style={{ margin: 0 }}>{product.name}</h2>

          <div style={{ fontSize: "14px", color: "#64748b" }}>
            ⭐ {product.rating} ({product.reviews} reviews)
          </div>

          <p style={{ fontSize: "14px", color: "#475569" }}>
            Premium quality product designed for comfort, durability and modern style.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h3 style={{ margin: 0 }}>${product.price}</h3>

            {product.oldPrice && (
              <span
                style={{
                  textDecoration: "line-through",
                  color: "#94a3b8",
                }}
              >
                ${product.oldPrice}
              </span>
            )}
          </div>

          {/* BUTTONS */}
          <div style={{ display: "flex", gap: "10px", marginTop: "auto" }}>
            <button
              onClick={() => onAddToCart(product)}
              style={{
                flex: 1,
                padding: "12px",
                border: "none",
                borderRadius: "10px",
                background: isAdded ? "#10b981" : "#f97316",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {isAdded ? "Added ✓" : "Add to Cart"}
            </button>

            <button
              onClick={onClose}
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                background: "white",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;