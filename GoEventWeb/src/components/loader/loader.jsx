import React from 'react';
import './loader.css';

export default function Loader({ text = "Loading GoEvent" }) {
  return (
    <div className="loader-overlay" aria-live="polite" aria-busy="true">
      <div className="loader-container">
        {/* Animated Spin Ring */}
        <div className="loader-spinner-ring">
          <div className="loader-spinner-inner"></div>
        </div>

        {/* Pulsing logo icon in the center */}
        <div className="loader-logo-pulsar">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
            <circle cx="12" cy="10" r="3" fill="#6366f1" />
          </svg>
        </div>

        {/* Loading details text */}
        <div className="loader-text">
          <span className="loader-text-shimmer">{text}</span>
          <span style={{ display: 'flex', gap: '2px', marginLeft: '2px' }}>
            <span className="loader-dot"></span>
            <span className="loader-dot"></span>
            <span className="loader-dot"></span>
          </span>
        </div>
      </div>
    </div>
  );
}
