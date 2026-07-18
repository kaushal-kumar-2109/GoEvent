import React from 'react';
import './comments_card.css';

export default function CommentsCard({ review, name, role, rating = 5, avatar }) {
  // Generate initials if avatar image is not provided
  const getInitials = (fullName) => {
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  return (
    <div className="comments-card">
      <div className="comments-card-stars">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`star-icon ${i < rating ? 'star-filled' : 'star-empty'}`}
            viewBox="0 0 24 24"
            width="18"
            height="18"
          >
            <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>

      <p className="comments-card-review">"{review}"</p>

      <div className="comments-card-author">
        <div className="author-avatar-wrapper">
          {avatar ? (
            <img src={avatar} alt={name} className="author-avatar" />
          ) : (
            <div className="author-avatar-initials">{getInitials(name)}</div>
          )}
        </div>
        <div className="author-info">
          <h5 className="author-name">{name}</h5>
          <span className="author-role">{role}</span>
        </div>
      </div>
    </div>
  );
}
