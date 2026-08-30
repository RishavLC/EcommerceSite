function CartDrawer({ cartItems, onClose, onQtyChange, onRemove, onCheckout }) {
  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount = cartItems.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <div className="cart-drawer">
        <div className="cart-header">
          <span className="cart-title">Your Cart</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {itemCount > 0 && <span className="cart-count">{itemCount} items</span>}
            <button
              onClick={onClose}
              style={{ background: "none", fontSize: 20, color: "#64748b" }}
            >✕</button>
          </div>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <span className="cart-empty-icon">🛒</span>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>Your cart is empty</p>
              <p style={{ fontSize: 13 }}>Add some products to get started</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-img">{item.image}</div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">${item.price}</div>
                  <div className="cart-item-qty">
                    <button className="qty-btn" onClick={() => onQtyChange(item.id, -1)}>−</button>
                    <span className="qty-num">{item.qty}</span>
                    <button className="qty-btn" onClick={() => onQtyChange(item.id, 1)}>+</button>
                  </div>
                </div>
                <button className="remove-btn" onClick={() => onRemove(item.id)}>🗑</button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal ({itemCount} items)</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="cart-subtotal">
              <span>Shipping</span>
              <span style={{ color: "#10b981" }}>{total >= 75 ? "Free" : "$5.99"}</span>
            </div>
            <div className="cart-total">
              <span>Total</span>
              <span>${(total >= 75 ? total : total + 5.99).toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={onCheckout}>Checkout →</button>
          </div>
        )}
      </div>
    </>
  );
}
export default CartDrawer;
