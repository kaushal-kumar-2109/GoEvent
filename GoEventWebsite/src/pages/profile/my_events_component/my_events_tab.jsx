import React, { useState } from 'react';

export default function MyEventsTab({ onTabChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const handleCreateClick = () => {
    if (typeof onTabChange === 'function') {
      onTabChange('create_event');
    }
  };
  
  // Local list of events to support delete functionality
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Music Festival 2024',
      date: '2024-12-20',
      dateStr: '20 - 22 Dec 2024',
      location: 'Jio World Garden, Mumbai',
      status: 'Published',
      ticketsSold: 1200,
      revenue: '₹24,00,000',
      image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=300&auto=format&fit=crop',
    },
    {
      id: 2,
      title: 'Tech Conference 2024',
      date: '2024-11-10',
      dateStr: '10 - 11 Nov 2024',
      location: 'NESCO Center, Mumbai',
      status: 'Published',
      ticketsSold: 450,
      revenue: '₹9,00,000',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=300&auto=format&fit=crop',
    },
    {
      id: 3,
      title: 'Digital Marketing Workshop',
      date: '2024-10-05',
      dateStr: '05 Oct 2024',
      location: 'WeWork, Bengaluru',
      status: 'Completed',
      ticketsSold: 80,
      revenue: '₹1,60,000',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=300&auto=format&fit=crop',
    },
    {
      id: 4,
      title: 'Startup Pitch Night 2024',
      date: '2024-09-18',
      dateStr: '18 Sep 2024',
      location: 'Indiranagar, Bengaluru',
      status: 'Completed',
      ticketsSold: 120,
      revenue: '₹1,20,000',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=300&auto=format&fit=crop',
    },
    {
      id: 5,
      title: 'AI & Web3 Summit 2025',
      date: '2025-02-15',
      dateStr: '15 Feb 2025',
      location: 'Jio World Convention Centre, Mumbai',
      status: 'Draft',
      ticketsSold: 0,
      revenue: '₹0',
      image: 'https://images.unsplash.com/photo-1591115765373-5209768f73e7?q=80&w=300&auto=format&fit=crop',
    }
  ]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  const handleCreateMockEvent = () => {
    const newEvent = {
      id: Date.now(),
      title: `Mock Event #${events.length + 1}`,
      date: '2025-05-10',
      dateStr: '10 May 2025',
      location: 'Online Webinar',
      status: 'Draft',
      ticketsSold: 0,
      revenue: '₹0',
      image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=300&auto=format&fit=crop',
    };
    setEvents([newEvent, ...events]);
  };

  // Filter events
  let filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'All') return matchesSearch;
    return matchesSearch && event.status === activeFilter;
  });

  // Sort events
  filteredEvents.sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'title') return a.title.localeCompare(b.title);
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
              {events.filter(e => tab === 'All' || e.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="events-grid-layout">
          {filteredEvents.map(event => (
            <div className="my-event-card" key={event.id}>
              <div className="card-image-wrap">
                <img src={event.image} alt={event.title} className="card-image" />
                <span className={`event-card-status status-${event.status.toLowerCase()}`}>
                  {event.status}
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
                    <span>{event.dateStr}</span>
                  </div>
                  <div className="meta-line">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="card-stats-row">
                  <div className="card-stat-box">
                    <span className="stat-label">Tickets Sold</span>
                    <span className="stat-value">{event.ticketsSold}</span>
                  </div>
                  <div className="card-stat-box">
                    <span className="stat-label">Revenue</span>
                    <span className="stat-value">{event.revenue}</span>
                  </div>
                </div>

                <div className="card-actions-row">
                  <button className="btn btn-secondary btn-sm flex-1">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit
                  </button>
                  <button className="btn btn-secondary btn-icon" onClick={() => handleDelete(event.id)} aria-label="Delete event">
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
