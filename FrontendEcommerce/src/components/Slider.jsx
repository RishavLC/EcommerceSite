import { useState, useEffect } from "react";

const SLIDES = [
  {
    title: "Summer Collection",
    subtitle: "Discover trendy styles for this season",
    cta: "Shop Now",
    emoji: "☀️",
    bg: "linear-gradient(135deg, #f97316, #fb923c)",
    accent: "#ea580c",
  },
  {
    title: "New Arrivals",
    subtitle: "Fresh fashion just dropped",
    cta: "Explore",
    emoji: "🔥",
    bg: "linear-gradient(135deg, #3b82f6, #60a5fa)",
    accent: "#2563eb",
  },
  {
    title: "Mega Sale",
    subtitle: "Up to 50% OFF on selected items",
    cta: "Grab Deals",
    emoji: "🛍️",
    bg: "linear-gradient(135deg, #10b981, #34d399)",
    accent: "#059669",
  },
];

function Slider() {
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);

  const next = () =>
    setCurrent((c) => (c + 1) % SLIDES.length);

  const slide = SLIDES[current];

  return (
    <div className="slider">
      <div
        className="slide"
        style={{ background: slide.bg }}
      >
        <div className="slide-content">
          <span className="slide-emoji">
            {slide.emoji}
          </span>

          <div className="slide-title">
            {slide.title}
          </div>

          <div className="slide-sub">
            {slide.subtitle}
          </div>

          <a
            href="#"
            className="slide-cta"
            style={{
              background: slide.accent,
              color: "#fff",
            }}
          >
            {slide.cta} →
          </a>
        </div>
      </div>

      <button
        className="slider-arrow left"
        onClick={prev}
      >
        ‹
      </button>

      <button
        className="slider-arrow right"
        onClick={next}
      >
        ›
      </button>

      <div className="slider-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`dot ${
              i === current ? "active" : ""
            }`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;