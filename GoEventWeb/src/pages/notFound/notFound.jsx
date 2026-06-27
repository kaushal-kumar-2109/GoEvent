import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../../components/navBar/navBar';
import SideBar from '../../components/sideBar/sideBar';
import Footer from '../../components/footer/footer';
import './notFound.css';

export default function NotFound({ isUserLoggedIn, setIsUserLoggedIn }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="notfound-wrapper">
      <NavBar
        isUserLoggedIn={isUserLoggedIn}
        setIsUserLoggedIn={setIsUserLoggedIn}
        onToggleSidebar={() => setSidebarOpen(true)}
        tag={"none"}
      />

      <SideBar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isUserLoggedIn={isUserLoggedIn}
        setIsUserLoggedIn={setIsUserLoggedIn}
        tag={"none"}
      />

      {/* Main Content */}
      <main className="notfound-main">
        <div className="notfound-glow-circle"></div>
        <div className="notfound-glow-circle-alt"></div>
        
        <div className="notfound-content">
          <div className="notfound-badge">ERROR 404</div>
          
          {/* Animated 404 Number Layout */}
          <div className="notfound-digits-container">
            <span className="digit animate-digit-1">4</span>
            <span className="digit-zero animate-digit-2">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="glowing-compass">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
            </span>
            <span className="digit animate-digit-3">4</span>
          </div>

          <h1 className="notfound-title">Lost in the Coordinates?</h1>
          <p className="notfound-description">
            The page you are looking for might have been moved, deleted, or is temporarily unavailable. 
            Let's get you back on track to finding amazing events!
          </p>

          <div className="notfound-buttons">
            <Link to="/GoEvent" className="btn-notfound-home">
              Go to Homepage
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </Link>
            <Link to="/GoEvent/events" className="btn-notfound-explore">
              Explore Events
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
