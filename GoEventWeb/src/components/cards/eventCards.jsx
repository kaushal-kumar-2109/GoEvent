import { useState } from "react";
import { Link } from "react-router-dom";
import "./eventCard.css";

const EventCard = ({ event }) => {
    const isoString = event.startDate;
    const dateObj = new Date(isoString);
    // Extract separate strings
    const dateOnly = dateObj.toLocaleDateString(); // e.g., "7/7/2026"
    // const timeOnly = dateObj.toLocaleTimeString(); // e.g., "3:49:56 PM"

    const [isFav, setIsFav] = useState(false);

    // Favorite button toggle
    const toggleFavorite = () => {
        setIsFav((prev) => !prev);
    };

    return (
        <Link to={`/GoEvent/event/${event._id}`} className="event-card">
            {/* Event Card Top Image Container */}
            <div className="event-image-container">
                <img src={event.bannerImage} alt={event.title} className="event-image" loading="lazy" />

                {/* Floating Date Badge */}
                <div className="event-date-badge">
                    <span className="event-date-month">{dateOnly}</span>
                    {/* <span className="event-date-day">{event.day}</span> */}
                </div>

                {/* Favorite toggle heart */}
                <button
                    type="button"
                    className={`event-favorite-btn ${isFav ? 'active' : ''}`}
                    onClick={toggleFavorite}
                    aria-label="Add to favorites"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                </button>
            </div>

            {/* Event Card Bottom Content */}
            <div className="event-info">
                <h3 className="event-card-title">{event.title}</h3>
                <div className="event-location">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{event.address}</span>
                </div>
                <div className="event-location">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                        <path d="M13 5v2" />
                        <path d="M13 17v2" />
                        <path d="M13 11v2" />
                    </svg>
                    <span>{event.availableSeats}</span>
                </div>

                <div className="event-meta">
                    <div className="event-category-badge">
                        <span className="event-category-dot" style={{ backgroundColor: event.color }}></span>
                        <span>{event.category}</span>
                    </div>
                    <div className="event-category-badge"><span>{event.eventMode}</span></div>
                    <span className="event-price">{event.ticketPrice}</span>
                </div>
            </div>
        </Link>
    );
}

export default EventCard;