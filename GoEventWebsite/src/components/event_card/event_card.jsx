import React from 'react';
import './event_card.css';

export default function EventCard({ event }) {
  return (
    <div className="event-card">
      <div className="event-card-image-wrapper">
        <img src={event.bannerImage} alt={event.title} className="event-card-image" />
        <span className="event-card-category">{event.category}</span>
        <span className="event-card-rating">
          <svg className="star-icon" viewBox="0 0 24 24" width="14" height="14">
            <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          {event.likes}
        </span>
      </div>
      <div className="event-card-content">
        <h4 className="event-card-title">{event.title}</h4>

        <div className="event-card-info-item">
          <svg viewBox="0 0 24 24" width="16" height="16" className="info-icon">
            <path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z" />
          </svg>
          <span>{(new Date(event.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }))}</span>
        </div>

        <div className="event-card-info-item">
          <svg viewBox="0 0 24 24" width="16" height="16" className="info-icon">
            <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          <span>{event.address}</span>
        </div>

        <div className="event-card-footer">
          <div className="event-card-price">
            <span className="price-label">Onwards</span>
            <span className="price-value">₹ {event.ticketPrice}</span>
          </div>
          <button className="event-card-btn">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
