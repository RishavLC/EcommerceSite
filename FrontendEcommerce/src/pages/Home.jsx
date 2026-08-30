import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Slider from "../components/Home/Slider";
import CardsGrid from "../components/Home/CardsGrid";
import Modal from "../components/Home/Modal";
import CartDrawer from "../components/Home/CartDrawer";
import Footer from "../components/Footer";

import ServiceHighlights from "../components/Home/ServiceHighlights";
import PromoBanner from "../components/Home/PromoBanner";
import Testimonials from "../components/Home/Testimonials";
import Newsletter from "../components/Home/Newsletter";
import BackToTop from "../components/BackToTop";
import { useCart } from "../context/CartContext";

function Home() {
  const [modalProduct, setModalProduct] = useState(null);
  const navigate = useNavigate();

  const {
    cartItems,
    cartOpen,
    setCartOpen,
    addToCart,
    changeQty,
    removeFromCart,
    cartCount,
  } = useCart();

  return (
    <>
      <Header cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

      <Slider />

      <ServiceHighlights />

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
          isAdded={cartItems.some((item) => item.id === modalProduct.id)}
        />
      )}

      {cartOpen && (
        <CartDrawer
          cartItems={cartItems}
          onClose={() => setCartOpen(false)}
          onQtyChange={changeQty}
          onRemove={removeFromCart}
          onCheckout={() => {
            setCartOpen(false);
            navigate("/checkout");
          }}
        />
      )}

      <BackToTop />
    </>
  );
}

export default Home;
