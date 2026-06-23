import React, { useState, useEffect } from 'react';
import NavBar from '../../components/navBar/navBar';
import SideBar from '../../components/sideBar/sideBar';
import Footer from '../../components/footer/footer';
import Loader from '../../components/loader/loader';
import './landing.css';

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Search input state
  const [searchParams, setSearchParams] = useState({
    location: '',
    date: '',
    category: 'all',
    query: ''
  });

  // Favorite button toggle
  const toggleFavorite = (eventId) => {
    setFavorites((prev) => {
      const newFavs = new Set(prev);
      if (newFavs.has(eventId)) {
        newFavs.delete(eventId);
      } else {
        newFavs.add(eventId);
      }
      return newFavs;
    });
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Search Query triggered:', searchParams);
    alert(`Searching for: \nQuery: ${searchParams.query || 'Any'} \nLocation: ${searchParams.location || 'Anywhere'} \nDate: ${searchParams.date || 'Anytime'} \nCategory: ${searchParams.category}`);
  };

  // Mock Categories
  const categoriesList = [
    {
      id: 'music',
      name: 'Music',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      )
    },
    {
      id: 'sports',
      name: 'Sports',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M6 12A6 6 0 0 1 18 12" />
          <path d="M12 6A6 6 0 0 1 12 18" />
        </svg>
      )
    },
    {
      id: 'business',
      name: 'Business',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      )
    },
    {
      id: 'technology',
      name: 'Technology',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="8" rx="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" />
          <line x1="6" x2="6" y1="10" y2="14" />
          <line x1="18" x2="18" y1="10" y2="14" />
        </svg>
      )
    },
    {
      id: 'food',
      name: 'Food & Drink',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      )
    },
    {
      id: 'art',
      name: 'Art & Culture',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.35857 19.5 5.85857 20 6.85857 20C7.85857 20 8.5 19.5 9 19C9.5 18.5 10 18.5 10.5 19C11 19.5 11.5 20 12 22Z" />
          <circle cx="7.5" cy="10.5" r="1.5" />
          <circle cx="11.5" cy="7.5" r="1.5" />
          <circle cx="16.5" cy="9.5" r="1.5" />
        </svg>
      )
    },
    {
      id: 'health',
      name: 'Health & Wellness',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      )
    },
    {
      id: 'community',
      name: 'Community',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    }
  ];

  // Mock Events
  const eventsList = [
    {
      id: 1,
      title: 'Summer Music Festival 2024',
      image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80',
      month: 'JUN',
      day: '15',
      location: 'Central Park, New York',
      category: 'Music',
      color: '#a855f7', // Purple
      price: '$49.00'
    },
    {
      id: 2,
      title: 'Tech Summit 2024',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
      month: 'JUN',
      day: '22',
      location: 'Convention Center, San Francisco',
      category: 'Technology',
      color: '#3b82f6', // Blue
      price: '$199.00'
    },
    {
      id: 3,
      title: 'Championship Finals',
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
      month: 'JUN',
      day: '28',
      location: 'Madison Square Garden, New York',
      category: 'Sports',
      color: '#f59e0b', // Amber/Orange
      price: '$89.00'
    },
    {
      id: 4,
      title: 'Food Festival 2024',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
      month: 'JUL',
      day: '05',
      location: 'Waterfront Park, Brooklyn',
      category: 'Food & Drink',
      color: '#10b981', // Green
      price: '$35.00'
    }
  ];

  if (isLoading) {
    return <Loader text="Loading GoEvent" />;
  }

  return (
    <div className="landing-wrapper">
      {/* Navigation bar */}
      <NavBar 
        isLoggedIn={isLoggedIn} 
        onLogout={() => setIsLoggedIn(false)} 
        onToggleSidebar={() => setSidebarOpen(true)} 
      />

      {/* Side drawer navigation */}
      <SideBar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        isLoggedIn={isLoggedIn} 
        onLogout={() => setIsLoggedIn(false)} 
      />

      {/* Hero Banner Section */}
      <header className="landing-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span>Discover Events.</span>
            <span className="hero-title-gradient">Create Memories.</span>
          </h1>
          <p className="hero-subtitle">
            Find the best events happening around you and book your experience in just a few clicks.
          </p>
          <div className="hero-buttons">
            <button className="btn-explore" onClick={() => alert('Browsing all upcoming events.')}>
              Explore Events
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" x2="19" y1="12" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <button className="btn-how" onClick={() => alert('How GoEvent works demo video.')}>
              How It Works
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
            </button>
          </div>
        </div>
        <div className="hero-overlay-bottom"></div>
      </header>

      {/* Floating Filters Widget */}
      <div className="search-widget-container">
        <form className="search-widget" onSubmit={handleSearchSubmit}>
          {/* Location field */}
          <div className="search-field">
            <div className="search-field-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="search-field-details">
              <label className="search-field-label" htmlFor="widget-location">Location</label>
              <input
                id="widget-location"
                type="text"
                name="location"
                className="search-field-input"
                placeholder="Search location"
                value={searchParams.location}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Date field */}
          <div className="search-field">
            <div className="search-field-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
            </div>
            <div className="search-field-details">
              <label className="search-field-label" htmlFor="widget-date">Date</label>
              <input
                id="widget-date"
                type="text"
                name="date"
                className="search-field-input"
                placeholder="Select date"
                value={searchParams.date}
                onChange={handleSearchChange}
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
              />
            </div>
          </div>

          {/* Category dropdown field */}
          <div className="search-field">
            <div className="search-field-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>
            <div className="search-field-details" style={{ position: 'relative', width: '100%' }}>
              <label className="search-field-label" htmlFor="widget-category">Category</label>
              <select
                id="widget-category"
                name="category"
                className="search-field-select"
                value={searchParams.category}
                onChange={handleSearchChange}
              >
                <option value="all">All categories</option>
                <option value="music">Music</option>
                <option value="sports">Sports</option>
                <option value="business">Business</option>
                <option value="technology">Technology</option>
                <option value="food">Food & Drink</option>
                <option value="art">Art & Culture</option>
                <option value="health">Health & Wellness</option>
              </select>
            </div>
          </div>

          {/* Keyword Search field */}
          <div className="search-field">
            <div className="search-field-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <div className="search-field-details">
              <label className="search-field-label" htmlFor="widget-query">Search</label>
              <input
                id="widget-query"
                type="text"
                name="query"
                className="search-field-input"
                placeholder="Events, artists, venues..."
                value={searchParams.query}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Search CTA button */}
          <button type="submit" className="btn-widget-search">
            Search
          </button>
        </form>
      </div>

      {/* Category Section */}
      <section className="section-container">
        <div className="section-header">
          <h2 className="section-title">Browse by Category</h2>
          <a href="#all-categories" className="section-link" onClick={(e) => { e.preventDefault(); alert('Show all categories catalog'); }}>
            View All
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </a>
        </div>

        <div className="categories-grid">
          {categoriesList.map((cat) => (
            <div key={cat.id} className="category-card" onClick={() => alert(`Selected Category: ${cat.name}`)}>
              <div className="category-icon">
                {cat.icon}
              </div>
              <span className="category-name">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="section-container" id="events">
        <div className="section-header">
          <h2 className="section-title">Featured Events</h2>
          <a href="#all-events" className="section-link" onClick={(e) => { e.preventDefault(); alert('Show all featured events'); }}>
            View All Events
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </a>
        </div>

        <div className="events-grid">
          {eventsList.map((event) => {
            const isFav = favorites.has(event.id);
            return (
              <div key={event.id} className="event-card">
                {/* Event Card Top Image Container */}
                <div className="event-image-container">
                  <img src={event.image} alt={event.title} className="event-image" loading="lazy" />
                  
                  {/* Floating Date Badge */}
                  <div className="event-date-badge">
                    <span className="event-date-month">{event.month}</span>
                    <span className="event-date-day">{event.day}</span>
                  </div>

                  {/* Favorite toggle heart */}
                  <button 
                    type="button" 
                    className={`event-favorite-btn ${isFav ? 'active' : ''}`}
                    onClick={() => toggleFavorite(event.id)}
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
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="event-meta">
                    <div className="event-category-badge">
                      <span className="event-category-dot" style={{ backgroundColor: event.color }}></span>
                      <span>{event.category}</span>
                    </div>
                    <span className="event-price">{event.price}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-container why-choose-us">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title" style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>Why Choose GoEvent?</h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            We provide the most robust platform for discovering local events and managing ticket sales with unparalleled ease.
          </p>
        </div>

        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
            </div>
            <h3 className="why-card-title">Easy Booking</h3>
            <p className="why-card-description">
              Secure your tickets in just 3 clicks with our seamless checkout process. Instant delivery to your email.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>
            <h3 className="why-card-title">Diverse Categories</h3>
            <p className="why-card-description">
              From local concerts to tech seminars, find the exact events that align with your lifestyle.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </div>
            <h3 className="why-card-title">Host & Manage</h3>
            <p className="why-card-description">
              Organize events, monitor real-time check-ins, and keep track of ticket revenue with our premium tools.
            </p>
          </div>
        </div>
      </section>

      {/* Footer component */}
      <Footer />

      {/* Developer Auth Toggle tool */}
      <div className="dev-auth-switcher">
        <span className={`dev-auth-dot ${isLoggedIn ? 'active' : 'inactive'}`}></span>
        <span>Mock User: <strong>{isLoggedIn ? 'LOGGED IN' : 'GUEST'}</strong></span>
        <button className="dev-auth-btn" onClick={() => setIsLoggedIn(!isLoggedIn)}>
          Toggle Auth State
        </button>
      </div>
    </div>
  );
}
