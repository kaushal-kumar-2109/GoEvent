import { Link, useNavigate } from 'react-router-dom';
import './sideBar.css';

export default function SideBar({ isOpen, onClose, isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  const handleNavClick = (path) => {
    onClose();
    navigate(path);
  };

  const handleOverlayClick = (e) => {
    // If the click happened on the overlay container directly (not the drawer card)
    if (e.target.classList.contains('sidebar-overlay')) {
      onClose();
    }
  };

  return (
    <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={handleOverlayClick}>
      <div className="sidebar-drawer">
        {/* Drawer Header */}
        <div className="sidebar-header">
          <Link to="/GoEvent" className="sidebar-logo" onClick={onClose}>
            <span className="sidebar-logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
            <span className="navbar-logo-text">GoEvent</span>
          </Link>
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        </div>

        {/* Menu Links */}
        <ul className="sidebar-menu">
          <li className="sidebar-menu-item">
            <Link to="/GoEvent" className="active" onClick={onClose}>
              Home
            </Link>
          </li>
          <li className="sidebar-menu-item">
            <a href="#events" onClick={(e) => { e.preventDefault(); onClose(); }}>
              Events
            </a>
          </li>
          <li className="sidebar-menu-item">
            <a href="#categories" onClick={(e) => { e.preventDefault(); onClose(); }}>
              Categories
            </a>
          </li>
          <li className="sidebar-menu-item">
            <a href="#venues" onClick={(e) => { e.preventDefault(); onClose(); }}>
              Venues
            </a>
          </li>
          <li className="sidebar-menu-item">
            <a href="#about" onClick={(e) => { e.preventDefault(); onClose(); }}>
              About Us
            </a>
          </li>
          <li className="sidebar-menu-item">
            <a href="#contact" onClick={(e) => { e.preventDefault(); onClose(); }}>
              Contact
            </a>
          </li>
        </ul>

        {/* Footer actions depending on Login State */}
        <div className="sidebar-footer">
          {isLoggedIn ? (
            <div className="sidebar-user-section">
              <div className="sidebar-profile-card">
                <div className="sidebar-profile-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="sidebar-profile-details">
                  <span className="sidebar-profile-name">{JSON.parse(localStorage.getItem("GoEventUserData"))?.name || "User"}</span>
                  <span className="sidebar-profile-email">{JSON.parse(localStorage.getItem("GoEventUserData"))?.email || "Email"}</span>
                </div>
              </div>
              <button
                className="sidebar-btn-logout"
                onClick={() => { onLogout(); onClose(); navigate("/GoEvent"); }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" x2="9" y1="12" y2="12" />
                </svg>
                Log Out
              </button>
            </div>
          ) : (
            <div className="sidebar-guest-actions">
              <button className="sidebar-btn-login" onClick={() => handleNavClick('/GoEvent/login')}>
                Login
              </button>
              <button className="sidebar-btn-signup" onClick={() => handleNavClick('/GoEvent/signup')}>
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
