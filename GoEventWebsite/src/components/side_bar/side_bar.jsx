import React, { useState, useEffect } from 'react';
import { getAvatarPath } from '../../utils/avatar_utils';
import './side_bar.css';

export default function SideBar({ isUserLoggedIN, setIsUserLoggedIn, isOpen, onClose, theme, onToggleTheme }) {

  const [getUserData, setUserData] = useState({});
  useEffect(() => {
    const raw = localStorage.getItem("GoEventUserData");
    if (raw) {
      setIsUserLoggedIn(true);
      setUserData(JSON.parse(raw));
    }
  }, []);

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
    <div className={`sidebar-wrapper ${isOpen ? 'open' : ''}`}>
      {/* Backdrop overlay */}
      <div className="sidebar-backdrop" onClick={onClose}></div>

      {/* Drawer Container */}
      <div className="sidebar-drawer">
        <div className="sidebar-header">
          {/* Logo */}
          <a href="/" className="sidebar-logo" onClick={onClose}>
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-4 5h-2v2h2v-2zm-4 0H9v2h2v-2z" />
              </svg>
            </div>
            <span className="logo-text">Go<span>Event</span></span>
          </a>

          {/* Close button */}
          <button className="close-btn" onClick={onClose} aria-label="Close menu">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="sidebar-nav">
          <a href="/GoEvent" onClick={() => { setNavBarIsActive("home"); onClose(); }} className={navBarIsActive === "home" ? "nav-link active" : "nav-link"}>Home</a>
          <a href="/GoEvent/events" onClick={() => { setNavBarIsActive("events"); onClose(); }} className={navBarIsActive === "events" ? "nav-link active" : "nav-link"}>Events</a>
          <a href="#about" onClick={() => { setNavBarIsActive("about"); onClose(); }} className={navBarIsActive === "about" ? "nav-link active" : "nav-link"}>About Us</a>
          <a href="#contact" onClick={() => { setNavBarIsActive("contact"); onClose(); }} className={navBarIsActive === "contact" ? "nav-link active" : "nav-link"}>Contact</a>
        </nav>

        {/* Divider */}
        <div className="sidebar-divider"></div>

        {/* Theme and Auth Actions */}
        <div className="sidebar-actions">
          <div className="theme-toggle-row">
            <span>Theme Mode</span>
            <button className="theme-toggle-btn" onClick={onToggleTheme}>
              {theme === 'dark' ? (
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
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
          </div>

          {
            (!isUserLoggedIN) ?
              <div className="sidebar-auth-buttons">
                <a href="/login" className="btn btn-secondary" onClick={onClose}>Log In</a>
                <a href="/register" className="btn btn-primary" onClick={onClose}>Sign Up</a>
              </div>
              :
              <div className="sidebar-profile-card">
                <div className="sidebar-profile-header">
                  <img
                    src={getAvatarPath(getUserData?.avatar)}
                    alt={getUserData?.name || "Profile"}
                    className="sidebar-profile-avatar"
                  />
                  <div className="sidebar-profile-info">
                    <span className="sidebar-profile-name">{getUserData?.name || "Profile"}</span>
                    <span className="sidebar-profile-email">{getUserData?.email || ""}</span>
                  </div>
                </div>
                <a href="/profile" className="btn btn-primary sidebar-profile-btn" onClick={onClose}>
                  View Profile
                </a>
              </div>
          }
        </div>
      </div>
    </div>
  );
}
