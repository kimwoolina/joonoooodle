import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="header-logo">
          <span className="tree-icon">🌳</span>
          <span>Tree Support Service</span>
        </Link>
        <nav className="header-nav">
          <Link to="/" className="nav-link">Submit Request</Link>
          <Link to="/admin" className="nav-link">Admin View</Link>
        </nav>
      </div>
    </header>
  );
}
