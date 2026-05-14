function Header({ cartCount, onCartOpen }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">shop<span>NEST</span></div>
        <nav className="nav">
          {["Home", "Products", "Sale", "About", "Contact"].map(n => (
            <a key={n} href="#">{n}</a>
          ))}
        </nav>
        <div className="header-right">
          <input className="search-bar" placeholder="🔍  Search products…" />
          <button className="icon-btn">♡</button>
          <button className="icon-btn" onClick={onCartOpen}>
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <button className="icon-btn">👤</button>
        </div>
      </div>
    </header>
  );
}


export default Header;