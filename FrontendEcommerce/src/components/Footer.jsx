function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <span className="logo">shop<span>NEST</span></span>
          <p>Your favorite destination for premium products. Quality, style, and value all in one place.</p>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            {["New Arrivals", "Best Sellers", "Sale Items", "Gift Cards", "All Products"].map(l => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            {["Help Center", "Track Order", "Returns", "Shipping Info", "Size Guide"].map(l => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            {["About Us", "Careers", "Press", "Privacy Policy", "Terms of Use"].map(l => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-bottom" style={{ maxWidth: 1200 }}>
        <span>© 2025 shopNEST. All rights reserved.</span>
        <div className="footer-socials">
          {["𝕏", "f", "ig", "in"].map(s => (
            <div key={s} className="social-icon">{s}</div>
          ))}
        </div>
      </div>
    </footer>
  );
}
export default Footer;