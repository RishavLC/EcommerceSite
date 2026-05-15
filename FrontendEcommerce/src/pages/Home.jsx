import { useState } from "react";

import Header from "../components/Header";
import Slider from "../components/Slider";
import CardsGrid from "../components/CardsGrid";
import Modal from "../components/Modal";
import CartDrawer from "../components/CartDrawer";
import Footer from "../components/Footer";

const STYLE = `
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    --bg: #f8fafc;
    --surface: #ffffff;
    --border: #e2e8f0;
    --text: #0f172a;
    --muted: #64748b;
    --accent: #f97316;
    --dark: #0f172a;
    --radius: 14px;
    --shadow: 0 4px 24px rgba(0,0,0,0.08);
  }

  body {
    font-family: 'Manrope', sans-serif;
    background: var(--bg);
    color: var(--text);
  }

  button {
    cursor: pointer;
    border: none;
    font-family: inherit;
  }
`;

function Home() {
  // Cart state
  const [cartItems, setCartItems] = useState([]);

  // Drawer open/close
  const [cartOpen, setCartOpen] = useState(false);

  // Product modal state
  const [modalProduct, setModalProduct] = useState(null);

  // Add product to cart
  function addToCart(product) {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);

      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  }

  // Increase / decrease quantity
  function changeQty(id, delta) {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, qty: item.qty + delta }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  }

  // Remove item
  function removeFromCart(id) {
    setCartItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  }

  // Total cart count
  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  return (
    <>
      {/* Global Styles */}
      <style>{STYLE}</style>

      {/* Header */}
      <Header
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
      />

      {/* Hero Slider */}
      <Slider />

      {/* Products Grid */}
      <CardsGrid
        onView={setModalProduct}
        onAddToCart={addToCart}
        cartItems={cartItems}
      />

      {/* Product Modal */}
      {modalProduct && (
        <Modal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          onAddToCart={(product) => {
            addToCart(product);
            setModalProduct(null);
          }}
          isAdded={cartItems.some(
            (item) => item.id === modalProduct.id
          )}
        />
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <CartDrawer
          cartItems={cartItems}
          onClose={() => setCartOpen(false)}
          onQtyChange={changeQty}
          onRemove={removeFromCart}
        />
      )}

      {/* Footer */}
      <Footer />
    </>
  );
}

export default Home;