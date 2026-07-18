import React from 'react';
import './footer.css';

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="footer-container container">
        {/* Upper footer */}
        <div className="footer-upper">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <a href="/" className="footer-logo">
              <div className="logo-icon">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-4 5h-2v2h2v-2zm-4 0H9v2h2v-2z" />
                </svg>
              </div>
              <span className="logo-text">Go<span>Event</span></span>
            </a>
            <p className="footer-description">
              Making event discovery and management simple and enjoyable for everyone.
            </p>
            <div className="social-icons">
              <a href="#facebook" className="social-link" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
              </a>
              <a href="#twitter" className="social-link" aria-label="Twitter">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M23.95 4.57a10 10 0 0 1-2.82.77 4.96 4.96 0 0 0 2.16-2.72 9.9 9.9 0 0 1-3.13 1.2 4.93 4.93 0 0 0-8.39 4.49A14 14 0 0 1 1.64 3.16a4.93 4.93 0 0 0 1.52 6.57 4.9 4.9 0 0 1-2.23-.62v.06a4.93 4.93 0 0 0 3.95 4.83 4.9 4.9 0 0 1-2.22.08 4.93 4.93 0 0 0 4.6 3.42A9.9 9.9 0 0 1 0 19.54a13.94 13.94 0 0 0 7.55 2.21c9.14 0 14.3-7.72 14.13-14.57A10.02 10.02 0 0 0 24 4.55z" />
                </svg>
              </a>
              <a href="#instagram" className="social-link" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#linkedin" className="social-link" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Column 1: Explore */}
          <div className="footer-links-col">
            <h5 className="footer-col-title">Explore</h5>
            <ul className="footer-links-list">
              <li><a href="#events">Events</a></li>
              <li><a href="#categories">Categories</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          {/* Links Column 2: Organizers */}
          <div className="footer-links-col">
            <h5 className="footer-col-title">For Organizers</h5>
            <ul className="footer-links-list">
              <li><a href="#create-event">Create Event</a></li>
              <li><a href="#dashboard">Organizer Dashboard</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#resources">Resources</a></li>
              <li><a href="#help">Help Center</a></li>
            </ul>
          </div>

          {/* Links Column 3: Support */}
          <div className="footer-links-col">
            <h5 className="footer-col-title">Support</h5>
            <ul className="footer-links-list">
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#terms">Terms & Conditions</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#refund">Refund Policy</a></li>
              <li><a href="#support">Contact Support</a></li>
            </ul>
          </div>

          {/* Links Column 4: App Download */}
          <div className="footer-app-col">
            <h5 className="footer-col-title">Download App</h5>
            <div className="app-download-buttons">
              <a href="#app-store" className="store-btn">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.17.67-2.88 1.49-.62.71-1.16 1.85-1.01 2.97 1.12.09 2.24-.59 2.9-1.4" />
                </svg>
                <div className="store-btn-text">
                  <span className="store-sub">Download on the</span>
                  <span className="store-main">App Store</span>
                </div>
              </a>

              <a href="#google-play" className="store-btn">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M3.25 2.25L12 11l3.38-3.38L3.92 2.58c-.28-.15-.55-.25-.67-.33m9.46 9.46l4.63 4.63c.27-.15.42-.3.54-.42l-4.63-4.63-4.63-4.63m-5.46-.71V13.5l4.38-4.38-4.38-4.38M20.25 12c0-.28-.1-.55-.25-.67l-3.38 3.38L20 18.08c.15-.28.25-.55.25-.67v-5.41z" />
                </svg>
                <div className="store-btn-text">
                  <span className="store-sub">GET IT ON</span>
                  <span className="store-main">Google Play</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Lower footer */}
        <div className="footer-lower">
          <p className="copyright-text">
            © 2024 Eventix. All rights reserved.
          </p>

          <div className="payment-methods">
            {/* Visa */}
            <span className="payment-icon visa">
              <svg viewBox="0 0 24 24" width="36" height="24" fill="currentColor">
                <path d="M10.15 15.65h1.9l1.2-7.3h-1.9l-1.2 7.3zm6.65-7.3h-1.45c-.45 0-.85.25-1 .65l-2.9 6.65h2l.4-.11.25-.69h2.2l.2.69h1.75l-1.45-7.19zm-2 4.4l.75-2.05.43 2.05h-1.18zm-11.25-4.4l.05.35c.95.25 1.8.65 2.45 1.15l-1.7 5.79h2l3-7.29h-2.1c-.8 0-1.4.5-1.7 1.15z" />
              </svg>
            </span>
            {/* MasterCard */}
            <span className="payment-icon mastercard">
              <svg viewBox="0 0 24 24" width="36" height="24" fill="currentColor">
                <path d="M9 16.5c2.485 0 4.5-2.015 4.5-4.5S11.485 7.5 9 7.5 4.5 9.515 4.5 12s2.015 4.5 4.5 4.5zm6 0c2.485 0 4.5-2.015 4.5-4.5s-2.015-4.5-4.5-4.5-4.5 2.015-4.5 4.5 2.015 4.5 4.5 4.5z" opacity="0.8" />
              </svg>
            </span>
            {/* PayPal */}
            <span className="payment-icon paypal">
              <svg viewBox="0 0 24 24" width="36" height="24" fill="currentColor">
                <path d="M20 7.5c0-2.485-2.015-4.5-4.5-4.5H8.5c-.83 0-1.5.67-1.5 1.5v12.5c0 .55.45 1 1 1h2.5c.55 0 1-.45 1-1V12.5h3c2.485 0 4.5-2.015 4.5-4.5v-.5z" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
