import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        {/* Brand details */}
        <div className="footer-brand">
          <Link to="/GoEvent" className="footer-logo">
            <span className="footer-logo-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
            <span className="footer-logo-text">GoEvent</span>
          </Link>
          <p className="footer-description">
            Discover amazing local events, book secure tickets, and create lifelong memories. Host and manage events effortlessly with our organizer tools.
          </p>
          <div className="footer-socials">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/kishore-kumar21-" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="footer-links-col">
          <h4 className="footer-links-title">Quick Links</h4>
          <ul className="footer-links-list">
            <li className="footer-link-item">
              <Link to="/GoEvent">Home</Link>
            </li>
            <li className="footer-link-item">
              <Link to="/GoEvent/events">Explore Events</Link>
            </li>
            <li className="footer-link-item">
              <Link to="/GoEvent/about">About Us</Link>
            </li>
            <li className="footer-link-item">
              <Link to="/GoEvent/contact">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Event Categories Column */}
        <div className="footer-links-col">
          <h4 className="footer-links-title">Categories</h4>
          <ul className="footer-links-list">
            <li className="footer-link-item">
              <Link to="/GoEvent/events">Music & Concerts</Link>
            </li>
            <li className="footer-link-item">
              <Link to="/GoEvent/events">Tech Summits</Link>
            </li>
            <li className="footer-link-item">
              <Link to="/GoEvent/events">Sports & Fitness</Link>
            </li>
            <li className="footer-link-item">
              <Link to="/GoEvent/events">Food & Drink</Link>
            </li>
          </ul>
        </div>

        {/* Organizer/Support Column */}
        <div className="footer-links-col">
          <h4 className="footer-links-title">Organizer & Support</h4>
          <ul className="footer-links-list">
            <li className="footer-link-item">
              <Link to="/GoEvent/contact">Organizer Guide</Link>
            </li>
            <li className="footer-link-item">
              <Link to="/GoEvent/contact">Help Center</Link>
            </li>
            <li className="footer-link-item">
              <Link to="/GoEvent/login">Host an Event</Link>
            </li>
            <li className="footer-link-item">
              <Link to="/GoEvent/signup">Get Started</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright row */}
      <div className="footer-bottom">
        <div className="footer-copyright">
          &copy; {new Date().getFullYear()} GoEvent Inc. All rights reserved.
        </div>
        <div className="footer-bottom-links">
          <Link to="/GoEvent/terms" className="footer-bottom-link">Terms of Service</Link>
          <Link to="/GoEvent/privacy" className="footer-bottom-link">Privacy Policy</Link>
          <Link to="/GoEvent/cookies" className="footer-bottom-link">Cookie Preferences</Link>
        </div>
      </div>
    </footer>
  );
}
