import { useState } from "react";

import Header from "../components/Header";
import Slider from "../components/Slider";
import CardsGrid from "../components/CardsGrid";
import Modal from "../components/Modal";
import CartDrawer from "../components/CartDrawer";
import Footer from "../components/Footer";

import ServiceHighlights from "../components/ServiceHighlights";
import CategorySection from "../components/CategorySection";
import PromoBanner from "../components/PromoBanner";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";
import BackToTop from "../components/BackToTop";

function Home() {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);

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

  function removeFromCart(id) {
    setCartItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  }

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  return (
    <>
      <Header
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
      />

      <Slider />

      <ServiceHighlights />

      <CategorySection />

      <CardsGrid
        onView={setModalProduct}
        onAddToCart={addToCart}
        cartItems={cartItems}
      />

      <PromoBanner />

      <Testimonials />

      <Newsletter />

      <Footer />

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

      {cartOpen && (
        <CartDrawer
          cartItems={cartItems}
          onClose={() => setCartOpen(false)}
          onQtyChange={changeQty}
          onRemove={removeFromCart}
        />
      )}

      <BackToTop />
    </>
  );
}

export default Home;