import { Link, Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="public-shell">
      <nav className="navbar">
        <Link to="/" className="brand" aria-label="LaundriTrack home">
          <span className="brand-mark">LT</span>
          <span>LaundriTrack</span>
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/track">Track Laundry</Link>
          <Link to="/login" className="nav-login">Staff login</Link>
        </div>
      </nav>
      <main className="container public-main">
        <Outlet />
      </main>
      <footer className="public-footer">Clean clothes, clear updates.</footer>
    </div>
  );
}