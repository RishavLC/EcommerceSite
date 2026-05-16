import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggle);
    return () => window.removeEventListener("scroll", toggle);
  }, []);

  return (
    visible && (
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={styles.btn}
      >
        ↑ Top
      </button>
    )
  );
}

const styles = {
  btn: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    padding: "10px 15px",
    borderRadius: "50%",
    background: "#0f172a",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};