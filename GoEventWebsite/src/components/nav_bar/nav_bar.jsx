import React, { useState, useEffect } from 'react';
import { getAvatarPath } from '../../utils/avatar_utils';
import './nav_bar.css';

export default function NavBar({ isUserLoggedIN, getUserData, theme, onToggleTheme, onOpenSidebar, getTheam, setTheam }) {
  const [navBarIsActive, setNavBarIsActive] = useState(() => {
    const path = window.location.pathname;
    if (path === "/GoEvent" || path === "/GoEvent/") return "home";
    if (path.includes("/GoEvent/events")) return "events";
    if (path.includes("/GoEvent/about")) return "about";
    if (path.includes("/GoEvent/contact")) return "contact";
    return "";
  });

  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/GoEvent" || path === "/GoEvent/") setNavBarIsActive("home");
    else if (path.includes("/GoEvent/events")) setNavBarIsActive("events");
    else if (path.includes("/GoEvent/about")) setNavBarIsActive("about");
    else if (path.includes("/GoEvent/contact")) setNavBarIsActive("contact");
    else setNavBarIsActive("");
  }, []);
  return (
    <header className="nav-bar-header">
      <div className="nav-bar-container container">
        {/* Logo */}
        <a href="/" className="nav-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M2 4C1.44772 4 1 4.44772 1 5V9C1 9.55228 1.44772 10 2 10H22C22.5523 10 23 9.55228 23 9V5C23 4.44772 22.5523 4 22 4H2ZM12 7H4V9H12V7ZM4 11V13H12V11H4ZM4 15V17H12V15H4ZM18 15V17H14V15H18ZM14 11V13H22V11H14ZM14 7V9H22V7H14ZM1 12V22H23V12H1ZM17.293 15.293L19.707 17.707L22.121 15.293L23 16.184L20.586 18.598L23 21H22L19.707 18.598L17.293 21H16.4L18.816 18.598L16.4 16.184L17.293 15.293Z" />
            </svg>
          </div>
          <span className="logo-text">Go<span>Event</span></span>
        </a>

        {/* Navigation Menu (Desktop) */}
        <nav className="desktop-nav">
          <a href="/GoEvent" onClick={() => setNavBarIsActive("home")} className={navBarIsActive === "home" ? "nav-link active" : "nav-link"}>Home</a>
          <a href="/GoEvent/events" onClick={() => setNavBarIsActive("events")} className={navBarIsActive === "events" ? "nav-link active" : "nav-link"}>Events</a>
          <a href="#about" onClick={() => setNavBarIsActive("about")} className={navBarIsActive === "about" ? "nav-link active" : "nav-link"}>About Us</a>
          <a href="#contact" onClick={() => setNavBarIsActive("contact")} className={navBarIsActive === "contact" ? "nav-link active" : "nav-link"}>Contact</a>
        </nav>

        {/* Right Section Actions */}
        <div className="nav-actions">
          {/* Theme Toggle Button */}
          <button className="theme-toggle-btn" onClick={onToggleTheme} aria-label="Toggle Theme">
            {getTheam === 'dark' ? (
              // Sun Icon
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              // Moon Icon
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>

          {/* Desktop auth buttons */}
          {
            (!isUserLoggedIN) ?
              <div className="auth-buttons-desktop">
                <a href="/login" className="btn btn-text">Log In</a>
                <a href="/register" className="btn btn-primary">Sign Up</a>
              </div>
              :
              <div className="auth-buttons-desktop">
                <a href="/profile" className="nav-profile-container">
                  <img
                    src={getAvatarPath(getUserData?.avatar)}
                    alt={getUserData?.name || "Profile"}
                    className="nav-profile-avatar"
                  />
                  <span className="nav-profile-name">{getUserData?.name || "Profile"}</span>
                </a>
              </div>
          }

          {/* Hamburger Menu Toggle (Mobile) */}
          <button className="hamburger-btn" onClick={onOpenSidebar} aria-label="Open Sidebar Menu">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
