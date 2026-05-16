export default function CategorySection() {
  const categories = [
    "Electronics",
    "Fashion",
    "Home",
    "Beauty",
    "Sports",
    "Books",
  ];

  return (
    <div style={styles.wrapper}>
      <h2>Shop by Category</h2>
      <div style={styles.grid}>
        {categories.map((cat, i) => (
          <div key={i} style={styles.card}>
            {cat}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { padding: "40px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: "15px",
    marginTop: "20px",
  },
  card: {
    background: "#f1f5f9",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    cursor: "pointer",
    transition: "0.3s",
  },
};