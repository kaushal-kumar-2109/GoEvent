import React from 'react';

export default function OverviewTab({ userData, onTabChange }) {
  // Mock events matching the image description
  const recentEvents = [
    {
      id: 1,
      title: 'Music Festival 2024',
      date: '20 - 22 Dec 2024',
      location: 'Jio World Garden, Mumbai',
      status: 'Published',
      image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=300&auto=format&fit=crop',
    },
    {
      id: 2,
      title: 'Tech Conference 2024',
      date: '10 - 11 Nov 2024',
      location: 'NESCO Center, Mumbai',
      status: 'Published',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=300&auto=format&fit=crop',
    },
    {
      id: 3,
      title: 'Digital Marketing Workshop',
      date: '05 Oct 2024',
      location: 'WeWork, Bengaluru',
      status: 'Completed',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=300&auto=format&fit=crop',
    }
  ];

  return (
    <div className="overview-tab-container">
      <div className="overview-grid">

        {/* Left Column: Profile Info & Recent Events */}
        <div className="overview-left-col">

          {/* Card: Profile Information */}
          <div className="profile-card info-card">
            <h3 className="card-title">Profile Information</h3>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Full Name</span>
                <span className="info-value">{userData.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email Address</span>
                <span className="info-value">{userData.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone Number</span>
                <span className="info-value">{userData.phone}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Location</span>
                <span className="info-value">{userData.location}</span>
              </div>
              <div className="info-item full-width">
                <span className="info-label">Bio</span>
                <span className="info-value bio-text">
                  {userData.bio}
                </span>
              </div>
              <div className="info-item full-width">
                <span className="info-label">Website</span>
                <a href={`${userData.website}`} target="_blank" rel="noreferrer" className="info-value web-link">
                  {userData.website}
                </a>
              </div>
            </div>
          </div>

          {/* Card: Recent Events */}
          <div className="profile-card recent-events-card">
            <div className="card-header-row">
              <h3 className="card-title">Recent Events</h3>
              {/* <button className="text-link-btn" onClick={() => onTabChange('my_events')}>View All Events</button> */}
            </div>
            <div className="events-list">
              {recentEvents.map(event => (
                <div className="event-item-card" key={event.id}>
                  <img src={event.image} alt={event.title} className="event-thumb" />
                  <div className="event-meta">
                    <h4 className="event-title">{event.title}</h4>
                    <div className="event-sub-meta">
                      <span className="event-date">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        {event.date}
                      </span>
                      <span className="event-loc">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {event.location}
                      </span>
                    </div>
                  </div>
                  <div className="event-actions-col">
                    <span className={`event-status-tag status-${event.status.toLowerCase()}`}>
                      {event.status}
                    </span>
                    <button className="btn btn-secondary btn-sm" onClick={() => onTabChange('my_events')}>View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Account Status, Host Promo, Quick Actions */}
        <div className="overview-right-col">

          {/* Card: Account Status */}
          <div className="profile-card status-card">
            <div className="card-header-row">
              <h3 className="card-title">Account Status</h3>
              <span className="verified-badge">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Verified
              </span>
            </div>
            <div className="status-list">
              <div className="status-item">
                <div className="status-label-group">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="status-icon">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>Member Since</span>
                </div>
                <span className="status-value">{userData.memberSince}</span>
              </div>

              <div className="status-item">
                <div className="status-label-group">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="status-icon">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Account Type</span>
                </div>
                <span className="status-value">{userData.role}</span>
              </div>


            </div>
          </div>

          {/* Card: Host Dashboard Promo Card */}
          {(userData.role === "HOST") ?
            <div className="host-promo-card">
              <h4>Host Dashboard</h4>
              <p>Manage your events, track sales and grow your audience.</p>
              <button className="promo-btn" onClick={() => onTabChange('my_events')}>
                Go to Dashboard
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="arrow-icon">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
            :
            <div className="host-promo-card">
              <h4>Promoter Dashboard</h4>
              <p>Update your account and manage your events, track sales and grow your audience.</p>
              <button className="promo-btn" onClick={() => onTabChange('my_events')}>
                Update Your Account
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="arrow-icon">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          }

          {/* Card: Quick Actions */}
          <div className="profile-card quick-actions-card">
            <h3 className="card-title">Quick Actions</h3>
            <div className="quick-actions-list">

              {(userData.role === "HOST") &&
                <button className="quick-action-item" onClick={() => onTabChange('my_events')}>
                  <div className="action-label-group">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="action-icon">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    <span>Create New Event</span>
                  </div>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="chevron-icon">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              }

              {(userData.role != "USER") &&
                <button className="quick-action-item" onClick={() => onTabChange('my_events')}>
                  <div className="action-label-group">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="action-icon">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    <span>Manage Events</span>
                  </div>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="chevron-icon">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              }

              <button className="quick-action-item" onClick={() => onTabChange('tickets_bookings')}>
                <div className="action-label-group">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="action-icon">
                    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"></path>
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                  </svg>
                  <span>View Bookings</span>
                </div>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="chevron-icon">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>

              <button className="quick-action-item" onClick={() => onTabChange('settings')}>
                <div className="action-label-group">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="action-icon">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  <span>Account Settings</span>
                </div>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="chevron-icon">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
