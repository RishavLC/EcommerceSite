export default function Testimonials() {
  const data = [
    { name: "Aarav", text: "Best shopping experience!" },
    { name: "Sita", text: "Very fast delivery." },
    { name: "Rahul", text: "Great quality products." },
  ];

  return (
    <div style={styles.wrapper}>
      <h2>What Customers Say</h2>
      <div style={styles.grid}>
        {data.map((t, i) => (
          <div key={i} style={styles.card}>
            <p>"{t.text}"</p>
            <h4>- {t.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { padding: "40px" },
  grid: {
    display: "flex",
    gap: "15px",
  },
  card: {
    flex: 1,
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
  },
};