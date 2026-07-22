import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GET_ORGANIZER_EVENTS, DELETE_EVENT } from '../../../apis/sender';
import { ToastSuccess, ToastError } from '../../../utils/toast_notification';

export default function MyEventsTab({ onTabChange }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrganizerEvents = async () => {
    setLoading(true);
    try {
      const res = await GET_ORGANIZER_EVENTS();
      if (res.success && res.events) {
        setEvents(res.events);
      } else {
        ToastError(res.message || 'Failed to fetch events.');
      }
    } catch (err) {
      console.error(err);
      ToastError('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizerEvents();
  }, []);

  const handleCreateClick = () => {
    if (typeof onTabChange === 'function') {
      onTabChange('create_event');
    }
  };

  const handleDelete = async (eid) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        const res = await DELETE_EVENT(eid);
        if (res.success) {
          ToastSuccess(res.message || 'Event deleted successfully!');
          setEvents(prev => prev.filter(e => e._id !== eid));
        } else {
          ToastError(res.message || 'Failed to delete event.');
        }
      } catch (err) {
        console.error(err);
        ToastError('Error deleting event.');
      }
    }
  };

  // Date Range formatter helper
  const formatEventDate = (start, end) => {
    if (!start || !end) return 'N/A';
    const sDate = new Date(start);
    const eDate = new Date(end);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };

    if (sDate.toDateString() === eDate.toDateString()) {
      return sDate.toLocaleDateString('en-US', options);
    }
    return `${sDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} - ${eDate.toLocaleDateString('en-US', options)}`;
  };

  // Filter events
  let filteredEvents = events.filter(event => {
    const titleMatch = (event.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const locMatch = (event.venueName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.city || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = titleMatch || locMatch;

    if (activeFilter === 'All') return matchesSearch;
    return matchesSearch && (event.status || '').toUpperCase() === activeFilter.toUpperCase();
  });

  // Sort events
  filteredEvents.sort((a, b) => {
    const dateA = new Date(a.startDate || a.createdAt);
    const dateB = new Date(b.startDate || b.createdAt);
    if (sortBy === 'newest') return dateB - dateA;
    if (sortBy === 'oldest') return dateA - dateB;
    if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
    return 0;
  });

  return (
    <div className="my-events-tab-container">
      <div className="tab-header-row">
        <div>
          <h2 className="tab-title">My Events</h2>
          <p className="tab-subtitle">Manage and monitor events hosted by you</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreateClick}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create New Event
        </button>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="events-control-bar">
        {/* Search */}
        <div className="search-box">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="search-icon">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search events by title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input search-input"
          />
        </div>

        {/* Filters and Sort */}
        <div className="filters-right-group">
          {/* Sorting */}
          <div className="sort-dropdown-container">
            <span className="sort-label">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Tabs Row */}
      <div className="events-filter-tabs">
        {['All', 'Published', 'Draft', 'Completed'].map(tab => (
          <button
            key={tab}
            className={`filter-tab-btn ${activeFilter === tab ? 'active' : ''}`}
            onClick={() => setActiveFilter(tab)}
          >
            {tab}
            <span className="tab-count">
              {events.filter(e => tab === 'All' || (e.status || '').toUpperCase() === tab.toUpperCase()).length}
            </span>
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <div className="spinner"></div>
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="events-grid-layout">
          {filteredEvents.map(event => (
            <div className="my-event-card" key={event._id}>
              <div className="card-image-wrap">
                <img
                  src={event.thumbnailImage || event.bannerImage || 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=300&auto=format&fit=crop'}
                  alt={event.title}
                  className="card-image"
                />
                <span className={`event-card-status status-${(event.status || 'DRAFT').toLowerCase()}`}>
                  {event.status || 'DRAFT'}
                </span>
              </div>
              <div className="card-body">
                <h3 className="event-title">{event.title}</h3>
                <div className="card-meta-info">
                  <div className="meta-line">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>{formatEventDate(event.startDate, event.endDate)}</span>
                  </div>
                  <div className="meta-line">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{event.venueName || 'N/A'}, {event.city || 'N/A'}</span>
                  </div>
                </div>

                <div className="card-stats-row">
                  <div className="card-stat-box">
                    <span className="stat-label">Seats Filled</span>
                    <span className="stat-value">{event.seatsFilled || 0} / {event.totalSeats || 0}</span>
                  </div>
                  <div className="card-stat-box">
                    <span className="stat-label">Revenue</span>
                    <span className="stat-value">₹{((event.seatsFilled || 0) * (event.ticketPrice || 0)).toLocaleString()}</span>
                  </div>
                </div>

                <div className="card-actions-row">
                  <button className="btn btn-secondary btn-sm flex-1" onClick={() => navigate(`/GoEvent/manage-event/${event._id}`)}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Manage
                  </button>
                  <button className="btn btn-secondary btn-icon" onClick={() => handleDelete(event._id)} aria-label="Delete event">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className="text-danger">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state-card">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <h3>No events found</h3>
          <p>We couldn't find any events matching your current filters or query.</p>
          <button className="btn btn-primary btn-sm" onClick={() => { setActiveFilter('All'); setSearchQuery(''); }}>
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
