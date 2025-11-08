import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">
          <span className="emoji">🤖</span> Agent Code Site
        </h1>
        <p className="header-subtitle">
          Chat with an AI agent that can modify a live website in real-time
        </p>
      </div>
    </header>
  )
}

export default Header
