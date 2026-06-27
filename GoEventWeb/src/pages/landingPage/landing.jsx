import React, { useState, useEffect } from 'react';
import NavBar from '../../components/navBar/navBar';
import SideBar from '../../components/sideBar/sideBar';
import Footer from '../../components/footer/footer';
import Loader from '../../components/loader/loader';
import './landing.css';
import EventCard from '../../components/cards/eventCards';
import { categoriesList } from '../../utils/mockData';
import { getLandData } from '../../api/getApiHandler/getData';
import { ToastError, ToastSuccess } from '../../assets/toast.jsx';
import { CheckUserAuth, RemoveUserAuth } from '../../middleware/chekUserAuth.jsx';

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [eventsList, setEventsList] = useState([]);

  const LoadData = async () => {
    setIsLoading(true);
    const res = await getLandData();
    if (res.flag) {
      setEventsList(res.data.data);
      ToastSuccess("Data loaded!");
    } else {
      console.error("Error " + res.error);
      ToastError(res.message);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    setIsLoggedIn(CheckUserAuth());
    LoadData();
  }, []);

  const handleLogout = () => {
    RemoveUserAuth();
    setIsLoggedIn(false);
    ToastSuccess("Logout successfully");
  };


  if (isLoading) {
    return <Loader text="Loading GoEvent" />;
  }
  return (
    <div className="landing-wrapper">
      {/* Navigation bar */}
      <NavBar
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onToggleSidebar={() => setSidebarOpen(true)}
        tag={"home"}
      />

      {/* Side drawer navigation */}
      <SideBar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        tag={"home"}
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

      {/* Category Section */}
      <section className="section-container">
        <div className="section-header">
          <h2 className="section-title">Browse by Category</h2>
          <a href="#" className="section-link">
            View All
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </a>
        </div>

        <div className="categories-grid">
          {categoriesList.map((cat) => (
            <div key={cat.id} className="category-card">
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
          <a href="#" className="section-link">
            View All Events
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </a>
        </div>

        <div className="events-grid">
          {eventsList.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
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
