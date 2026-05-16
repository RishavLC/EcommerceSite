export default function PromoBanner() {
  return (
    <div style={styles.banner}>
      <h2>🔥 Mega Sale Up to 50% Off</h2>
      <button>Shop Now</button>
    </div>
  );
}

const styles = {
  banner: {
    margin: "40px",
    padding: "40px",
    background: "#0f172a",
    color: "#fff",
    borderRadius: "16px",
    textAlign: "center",
  },
};