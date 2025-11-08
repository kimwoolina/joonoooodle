import './Header.css';

function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M12 2c-3 0-5 2-5 5s2 5 5 5m0-10c3 0 5 2 5 5s-2 5-5 5m0 0c-3 0-5 2-5 5m5-5c3 0 5 2 5 5" />
            </svg>
          </div>
          <div className="header-title">
            <h1>Seoul Tree Map</h1>
            <p className="subtitle">서울 나무 지도</p>
          </div>
        </div>
        <div className="header-right">
          <div className="tree-count">
            <span className="count-label">Total Trees</span>
            <span className="count-number">700</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
