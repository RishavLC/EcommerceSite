function Stars({ rating }) {
  return (
    <span>
      {"⭐".repeat(Math.round(rating))}
    </span>
  );
}

export default Stars;