import { useEffect, useState } from 'react';
import './home_page.css';
import EventCard from '../../../components/event_card/event_card';
import CommentsCard from '../../../components/comments_card/comments_card';
import { GET_LANDING_EVENTS } from '../../../apis/sender';
import { ToastError } from '../../../utils/toast_notification';
import Loader from '../../../components/loader/loader';

export default function HomePage({ getTheam }) {

  const [isLoader, setIsLoader] = useState(false);
  const [getEvents, setEvents] = useState([]);
  const [getHeroLinks, setHeroLinks] = useState([]);
  const [getIdx, setIdx] = useState(0);

  const fetchEvents = async () => {
    const response = await GET_LANDING_EVENTS();
    if (response.status != 200) {
      ToastError(response.message, getTheam);
      return;
    }
    setEvents(response.events);
    let temp = [];
    for (let i = 0; i < response.events.length; i++) {
      temp.push(response.events[i].bannerImage);
    }
    setHeroLinks(temp);
  }

  useEffect(() => {
    if (getHeroLinks.length <= 1) return;
    const interval = setInterval(() => {
      setIdx((prevIdx) => (prevIdx === getHeroLinks.length - 1 ? 0 : prevIdx + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [getHeroLinks]);

  useEffect(() => {
    setIsLoader(true);
    fetchEvents();
    setIsLoader(false);
  }, []);

  // Hardcoded category data
  const categories = [
    {
      name: "Music",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      )
    },
    {
      name: "Business",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
        </svg>
      )
    },
    {
      name: "Workshop",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.5 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
        </svg>
      )
    },
    {
      name: "Conference",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
        </svg>
      )
    },
    {
      name: "Sports",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v3c0 2.44 1.72 4.48 4 4.88V18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-3.12c2.28-.4 4-2.44 4-4.88V7c0-1.1-.9-2-2-2zm-12 5V7h2v3H7zm10 0h-2V7h2v3z" />
        </svg>
      )
    },
    {
      name: "Education",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 13c-2.76 0-5-2.24-5-5H5c0 3.87 3.13 7 7 7s7-3.13 7-7h-2c0 2.76-2.24 5-5 5z" />
        </svg>
      )
    },
    {
      name: "Food & Drink",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm8-3h-3v7h3c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z" />
        </svg>
      )
    },
    {
      name: "More",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      )
    }
  ];

  // Hardcoded step data
  const steps = [
    {
      number: "1",
      title: "Discover",
      desc: "Find events that match your interests.",
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28">
          <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
      )
    },
    {
      number: "2",
      title: "Book",
      desc: "Choose your tickets & book securely.",
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28">
          <path fill="currentColor" d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-1.99 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-9 7.5h-2v-2h2v2zm0-4.5h-2v-2h2v2zm0-4.5h-2V6h2v2z" />
        </svg>
      )
    },
    {
      number: "3",
      title: "Attend",
      desc: "Get your QR ticket and attend the event.",
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28">
          <path fill="currentColor" d="M3 3v6h6V3H3zm4.5 4.5h-3v-3h3v-3zM3 15v6h6v-6H3zm4.5 4.5h-3v-3h3v-3zM15 3v6h6V3h-6zm4.5 4.5h-3v-3h3v-3zM19.5 19.5h-1.5v-1.5h1.5v1.5zm-3-3h-1.5v-1.5h1.5v1.5zm3-3h-1.5v-1.5h1.5v1.5zm-3-3h-1.5v-1.5h1.5v1.5zm3 3h-1.5v-1.5h1.5v1.5zm-6 6h-1.5v-1.5h1.5v1.5zm6 0H18v-1.5h1.5v1.5zm-3-3H15v-1.5h1.5v1.5zm0-3h-1.5V12h1.5v1.5z" />
        </svg>
      )
    },
    {
      number: "4",
      title: "Enjoy",
      desc: "Have a great time and create memories!",
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28">
          <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      )
    }
  ];

  return (
    <div className="homepage-wrapper">

      {/* 1. HERO SECTION */}
      <section className="hero-section container" id="home">
        <div className="hero-content">
          <span className="hero-tagline">Discover. Book. Experience.</span>
          <h1 className="hero-title">
            Find & Book Amazing <span className="hero-title-highlight">Events</span> Near You
          </h1>
          <p className="hero-desc">
            Eventix is your one-stop platform for discovering, booking and managing events effortlessly.
          </p>

          {/* Responsive Search Box */}
          <div className="search-box-container">
            <div className="search-input-field">
              <svg className="search-field-icon" viewBox="0 0 24 24" width="18" height="18">
                <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <input type="text" placeholder="Search events, concerts..." className="search-input" />
            </div>
            <div className="search-input-field">
              <svg className="search-field-icon" viewBox="0 0 24 24" width="18" height="18">
                <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <input type="text" placeholder="Location" className="search-input" />
            </div>
            <div className="search-input-field">
              <svg className="search-field-icon" viewBox="0 0 24 24" width="18" height="18">
                <path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z" />
              </svg>
              <input type="text" placeholder="Date" className="search-input" />
            </div>
            <button className="btn btn-primary search-btn">Search Events</button>
          </div>

          {/* Popular searches */}
          <div className="popular-searches">
            <span className="popular-title">Popular Searches:</span>
            <div className="popular-tags">
              <span className="tag">Music</span>
              <span className="tag">Business</span>
              <span className="tag">Workshop</span>
              <span className="tag">Conference</span>
              <span className="tag">Sports</span>
            </div>
          </div>
        </div>

        {/* Hero Illustration Collage */}
        <div className="hero-illustration">
          <div className="illustration-glow"></div>
          <div className="main-frame-card">
            <img
              key={getIdx}
              src={getHeroLinks[getIdx]}
              alt="Event Showcase"
              className="illustration-main-img"
            />
          </div>

          {/* Floating Badge Card 1 */}
          <div className="floating-badge-card badge-1">
            <div className="badge-details">
              <span className="badge-metric">50K+</span>
              <span className="badge-desc">Events Happening</span>
              <div className="badge-avatars">
                <div className="mini-avatar av-1">S</div>
                <div className="mini-avatar av-2">M</div>
                <div className="mini-avatar av-3">E</div>
                <div className="mini-avatar av-plus">+</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR SECTION */}
      <section className="stats-section container">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <svg viewBox="0 0 24 24" width="22" height="22">
                <path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z" />
              </svg>
            </div>
            <div className="stat-info">
              <h3>50K+</h3>
              <p>Events</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <svg viewBox="0 0 24 24" width="22" height="22">
                <path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
            </div>
            <div className="stat-info">
              <h3>200K+</h3>
              <p>Happy Users</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <svg viewBox="0 0 24 24" width="22" height="22">
                <path fill="currentColor" d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" />
              </svg>
            </div>
            <div className="stat-info">
              <h3>100+</h3>
              <p>Categories</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <svg viewBox="0 0 24 24" width="22" height="22">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15.5h-2v-2h2v2zm0-4.5h-2V7h2v6z" />
              </svg>
            </div>
            <div className="stat-info">
              <h3>24/7</h3>
              <p>Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. POPULAR CATEGORIES SECTION */}
      <section className="categories-section container" id="categories">
        <div className="section-header">
          <h2 className="section-title">Popular Categories</h2>
          <p className="section-subtitle">Browse events by your favorite categories</p>
        </div>

        <div className="categories-grid">
          {categories.map((cat, idx) => (
            <div className="category-card" key={idx}>
              <div className="category-icon-wrapper">{cat.icon}</div>
              <span className="category-name">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED EVENTS SECTION */}
      <section className="events-section container" id="events">
        <div className="events-section-header">
          <div className="section-header">
            <h2 className="section-title">Featured Events</h2>
            <p className="section-subtitle">Handpicked events just for you</p>
          </div>
          <a href="#events" className="view-all-link">
            View All Events
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>

        <div className="events-grid">
          {(isLoader) ? <Loader />
            : (getEvents.length > 0) ? getEvents.map((evt) => (
              <EventCard
                key={evt._id}
                event={evt}
              />
            )) :
              <div className="no-events">
                <div className="no-events-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                    <circle cx="12" cy="16" r="3"></circle>
                    <line x1="14.2" y1="18.2" x2="17" y2="21"></line>
                  </svg>
                </div>
                <h3 className="no-events-title">No Events Found</h3>
                <p className="no-events-desc">
                  We couldn't find any upcoming events right now. Check back later or try refreshing the list.
                </p>
                <button className="btn btn-primary no-events-btn" onClick={fetchEvents}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }}>
                    <path d="M23 4v6h-6"></path>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                  </svg>
                  Refresh Events
                </button>
              </div>
          }
        </div>
      </section>

      {/* 5. ORGANIZER CTA BANNER */}
      <section className="organizer-section container">
        <div className="organizer-banner">
          <div className="banner-content">
            <h2 className="banner-title">Are you an Organizer?</h2>
            <h3 className="banner-subtitle">Host your events with ease.</h3>
            <p className="banner-desc">
              Create, manage and promote your events to the right audience.
            </p>
            <button className="btn btn-secondary banner-btn">Create Event</button>
          </div>

          <div className="banner-graphic">
            <div className="graphic-backdrop"></div>
            {/* Embedded illustration grid mockup */}
            <div className="graphic-dashboard-mockup">
              <div className="mockup-header">
                <div className="mockup-dot"></div>
                <div className="mockup-dot"></div>
                <div className="mockup-dot"></div>
              </div>
              <div className="mockup-body">
                <div className="mockup-stat-row">
                  <div className="mockup-pill-green">Active Gold Ticket</div>
                  <div className="mockup-text-right">$ 2940</div>
                </div>
                <div className="mockup-line long"></div>
                <div className="mockup-line medium"></div>
                <div className="mockup-chart">
                  <div className="chart-bar h-1"></div>
                  <div className="chart-bar h-2"></div>
                  <div className="chart-bar h-3"></div>
                  <div className="chart-bar h-4"></div>
                  <div className="chart-bar h-5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS SECTION */}
      <section className="how-it-works-section container" id="how-it-works">
        <div className="section-header centered">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Simple steps to book your favorite events</p>
        </div>

        <div className="steps-container">
          {steps.map((step, idx) => (
            <div className="step-card" key={idx}>
              <div className="step-badge-num">{step.number}</div>
              <div className="step-icon-wrapper">{step.icon}</div>
              <h4 className="step-title">{step.title}</h4>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. TESTIMONIALS SECTION */}
      <section className="testimonials-section container">
        <div className="section-header centered">
          <h2 className="section-title">What People Say</h2>
          <p className="section-subtitle">Hear from our happy customers</p>
        </div>

        <div className="testimonials-grid">
          <CommentsCard
            review="Eventix made it so easy to find and book events. The QR ticket system is super convenient!"
            name="Sarah Johnson"
            role="Event Attendee"
            rating={5}
          />
          <CommentsCard
            review="As an organizer, Eventix helped me reach a wider audience and manage everything smoothly."
            name="Michael Brown"
            role="Event Organizer"
            rating={5}
          />
          <CommentsCard
            review="The best platform for event discovery. I always find amazing events near me."
            name="Emily Davis"
            role="Event Enthusiast"
            rating={5}
          />
        </div>
      </section>

      {/* 8. NEWSLETTER SUBSCRIBE SECTION */}
      <section className="newsletter-section container">
        <div className="newsletter-banner">
          <div className="newsletter-info">
            <h2 className="newsletter-title">Subscribe to our newsletter</h2>
            <p className="newsletter-desc">
              Get the latest events, updates and offers straight to your inbox.
            </p>
          </div>

          <div className="newsletter-form-wrapper">
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" className="form-input newsletter-input" required />
              <button type="submit" className="btn btn-primary newsletter-btn">Subscribe</button>
            </form>
          </div>

          <div className="newsletter-decoration">
            {/* Letter/Envelope SVG */}
            <svg viewBox="0 0 24 24" width="80" height="80" className="letter-svg">
              <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </div>
        </div>
      </section>

    </div>
  );
}
