function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a className="navbar-brand" href="/">ShopNow</a>
        <div className="navbar-nav ms-auto">
          <a className="nav-link" href="/">Home</a>
          <a className="nav-link" href="/products">Products</a>
          <a className="nav-link" href="/cart">Cart</a>
        </div>
      </div>
    </nav>
  );
}

export default Header;