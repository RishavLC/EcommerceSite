export default function ServiceHighlights() {
  const items = [
    { title: "Free Shipping", desc: "On all orders" },
    { title: "Secure Payment", desc: "100% protected" },
    { title: "Easy Returns", desc: "7 days policy" },
    { title: "24/7 Support", desc: "Always here" },
  ];

  return (
    <div style={styles.container}>
      {items.map((item, i) => (
        <div key={i} style={styles.card}>
          <h3>{item.title}</h3>
          <p>{item.desc}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    padding: "40px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
};