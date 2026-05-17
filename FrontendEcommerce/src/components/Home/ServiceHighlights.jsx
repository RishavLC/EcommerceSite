export default function ServiceHighlights() {
  const items = [
    { title: "Free Shipping", desc: "On all orders" },
    { title: "Secure Payment", desc: "100% protected" },
    { title: "Easy Returns", desc: "7 days policy" },
    { title: "24/7 Support", desc: "Always here" },
  ];

  return (
    <>
      <div className="container">
            {items.map((item, i) => (
              <div key={i} className="card">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
      </div>
      <style>{`
        .container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          padding: 40px;
        }
        .card {
          background: #fff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          text-align: center;
        }
        .card:hover{
          transform: translateY(-4px);
          box-shadow: var(--shadow)
          }
        `}
      </style>
</>
)
}
