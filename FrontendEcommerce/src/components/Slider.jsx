function Slider() {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setCurrent((c) => (c + 1) % SLIDES.length);
  const slide = SLIDES[current];

  return (
    <div className="slider">
      <div className="slide" style={{ background: slide.bg }}>
        <div className="slide-content">
          <span className="slide-emoji">{slide.emoji}</span>
          <div className="slide-title">{slide.title}</div>
          <div className="slide-sub">{slide.subtitle}</div>
          <a href="#" className="slide-cta" style={{ background: slide.accent, color: "#fff" }}>
            {slide.cta} →
          </a>
        </div>
      </div>
      <button className="slider-arrow left" onClick={prev}>‹</button>
      <button className="slider-arrow right" onClick={next}>›</button>
      <div className="slider-dots">
        {SLIDES.map((_, i) => (
          <button key={i} className={`dot ${i === current ? "active" : ""}`} onClick={() => setCurrent(i)} />
        ))}
      </div>
    </div>
  );
}
export default Slider;