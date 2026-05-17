function Header({ cartCount, onCartOpen }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">shop<span>NEST</span></div>
        <nav className="nav">
          {["Home", "Products", "Sale", "About", "Contact"].map(n => (
            <a key={n} href="/products">{n}</a>
          ))}
        </nav>
        <div className="header-right">
          <select name="category" id="category" className="category">
            <option className="category-opt" value="all">All</option>
            <option className="category-opt" value="Electronics">Electronics</option>
            <option className="category-opt" value="Fashion">Fashion</option>
            <option className="category-opt" value="Beauty">Beauty</option>
            <option className="category-opt" value="Sports">Sports</option>
            <option className="category-opt" value="Books">Books</option>
          </select>
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