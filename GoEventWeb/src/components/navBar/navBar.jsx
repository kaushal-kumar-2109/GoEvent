import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckUserAuth, RemoveUserAuth } from '../../middleware/chekUserAuth';
import './navBar.css';

export default function NavBar({ isUserLoggedIn, setIsUserLoggedIn, onToggleSidebar, tag }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();


  const LogOutUser = () => {
    RemoveUserAuth();
    setDropdownOpen(false);
    setIsUserLoggedIn(false);
    navigate("/GoEvent");
  }

  // Close dropdown if user clicks outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <nav className="navbar-wrapper">
      <div className="navbar-container">
        {/* Mobile Hamburger menu toggle */}
        <button
          className="navbar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Open navigation menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>

        {/* Logo */}
        <Link to="/GoEvent" className="navbar-logo">
          <span className="navbar-logo-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </span>
          <span className="navbar-logo-text">GoEvent</span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="navbar-links">
          <li className="navbar-link-item">
            <Link to="/GoEvent" className={(tag === "home") ? "active" : ""}>Home</Link>
          </li>
          <li className="navbar-link-item">
            <Link to="/GoEvent/events" className={(tag === "events") ? "active" : ""}>Events</Link>
          </li>
          {/* <li className="navbar-link-item">
            <a href="#categories" onClick={(e) => e.preventDefault()}>Categories</a>
          </li>
          <li className="navbar-link-item">
            <a href="#venues" onClick={(e) => e.preventDefault()}>Venues</a>
          </li> */}
          <li className="navbar-link-item">
            <Link to="/GoEvent/about" className={(tag === "about") ? "active" : ""}>About Us</Link>
          </li>
          <li className="navbar-link-item">
            <Link to="/GoEvent/contact" className={(tag === "contact") ? "active" : ""}>Contact</Link>
          </li>
        </ul>

        {/* Action Buttons */}
        <div className="navbar-actions">
          {/* Search Toggle icon */}
          {/* <button className="navbar-search-btn" aria-label="Search Events">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button> */}

          {isUserLoggedIn ? (
            <>
              {/* "+ Create Event" Button */}
              <button className="navbar-btn-create" onClick={() => alert('Feature coming soon: Event Planner Studio')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                <span>Create Event</span>
              </button>

              {/* Profile Avatar Dropdown */}
              <div className="navbar-profile-container" ref={dropdownRef}>
                <button
                  className="navbar-profile-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-label="User profile options"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="navbar-profile-dropdown">
                    <div className="dropdown-user-info">
                      <div className="dropdown-user-name">{JSON.parse(localStorage.getItem("GoEventUserData")).name}</div>
                      <div className="dropdown-user-email">{JSON.parse(localStorage.getItem("GoEventUserData")).email}</div>
                    </div>
                    <button className="dropdown-item" onClick={() => { setDropdownOpen(false); alert('My Profile details.'); }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" x2="9.01" y1="9" y2="9" /><line x1="15" x2="15.01" y1="9" y2="9" />
                      </svg>
                      My Profile
                    </button>
                    <button className="dropdown-item" onClick={() => { setDropdownOpen(false); alert('List of my hosted/registered events.'); }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
                      </svg>
                      My Events
                    </button>
                    <button className="dropdown-item logout" onClick={() => LogOutUser()}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
                      </svg>
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Login and Signup option */}
              <p style={{ color: "#fff" }}><Link to='/GoEvent/login' style={{ color: "#fff", textDecoration: "none" }}>Login</Link> / <Link to='/GoEvent/signup' style={{ color: "#fff", textDecoration: "none" }}>Sign Up</Link></p>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
