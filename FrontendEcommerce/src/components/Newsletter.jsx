export default function Newsletter() {
  return (
    <div style={styles.wrapper}>
      <h2>Subscribe for Updates</h2>
      <div>
        <input placeholder="Enter email" style={styles.input} />
        <button style={styles.button}>Subscribe</button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: "40px",
    textAlign: "center",
    background: "#f8fafc",
  },
  input: {
    padding: "10px",
    width: "250px",
    marginRight: "10px",
  },
  button: {
    padding: "10px 20px",
    background: "#f97316",
    color: "#fff",
  },
};