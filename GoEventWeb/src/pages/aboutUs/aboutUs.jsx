import React, { useState, useEffect } from 'react';
import NavBar from '../../components/navBar/navBar';
import SideBar from '../../components/sideBar/sideBar';
import Footer from '../../components/footer/footer';
import { ToastSuccess } from '../../assets/toast.jsx';
import { CheckUserAuth, RemoveUserAuth } from '../../middleware/chekUserAuth.jsx';
import './aboutUs.css';

export default function AboutUs() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('mission');

  useEffect(() => {
    setIsLoggedIn(CheckUserAuth());
    window.scrollTo(0, 0);
  }, []);

  const handleLogout = () => {
    RemoveUserAuth();
    setIsLoggedIn(false);
    ToastSuccess("Logout successfully");
  };

  const teamMembers = [
    {
      name: "Sophia Martinez",
      role: "CEO & Co-Founder",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      bio: "Sophia has over a decade of experience in event operations and is passionate about building tools that bring community ideas to life.",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    },
    {
      name: "Marcus Chen",
      role: "CTO & Co-Founder",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "A full-stack engineer and open-source enthusiast. Marcus leads the architecture, ensuring security, scalability, and seamless check-ins.",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    },
    {
      name: "Elena Rostova",
      role: "Head of Community",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
      bio: "Elena connects creators and organizers around the globe, driving program designs and partnerships that grow the GoEvent ecosystem.",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    }
  ];

  const values = [
    {
      title: "Community First",
      desc: "We build features designed around human connection. Our platform exists to facilitate shared experiences and meaningful encounters.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      title: "Seamless Simplicity",
      desc: "From hosting to checkout, we eliminate technological barriers so organizers can focus on content and guests can focus on fun.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )
    },
    {
      title: "Radical Transparency",
      desc: "No hidden booking fees, no sudden platform shifts. Our open pricing structures ensure creators receive their hard-earned revenue instantly.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="16" y2="12" />
          <line x1="12" x2="12.01" y1="8" y2="8" />
        </svg>
      )
    },
    {
      title: "Reliable Safety",
      desc: "Our platform incorporates secure payment gateways, QR ticket verification, and real-time fraud mitigation tools for every booking.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      )
    }
  ];

  return (
    <div className="about-wrapper">
      <NavBar
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onToggleSidebar={() => setSidebarOpen(true)}
        tag={"about"}
      />

      <SideBar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        tag={"about"}
      />

      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-blur-bg"></div>
        <div className="about-hero-content">
          <span className="about-badge">WHO WE ARE</span>
          <h1 className="about-hero-title animate-title">
            Empowering People to <br />
            <span className="gradient-text">Connect & Experience</span>
          </h1>
          <p className="about-hero-subtitle">
            GoEvent is the ultimate platform for discovering, organizing, and celebrating experiences. 
            We make event creation and booking incredibly fast, beautiful, and accessible.
          </p>
        </div>
      </section>

      {/* Story & Tab Content Section */}
      <section className="about-tabs-section">
        <div className="container">
          <div className="tabs-grid">
            <div className="tabs-left">
              <h2 className="section-title-alt">Our Journey & Philosophy</h2>
              <p className="tabs-desc">
                We believe that human beings thrive on shared experiences. Whether it's a small local meetup, a dynamic music concert, or an international tech summit, GoEvent provides the foundation to host effortlessly.
              </p>
              
              <div className="tab-buttons">
                <button 
                  className={`tab-btn ${activeTab === 'mission' ? 'active' : ''}`}
                  onClick={() => setActiveTab('mission')}
                >
                  Our Mission
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'vision' ? 'active' : ''}`}
                  onClick={() => setActiveTab('vision')}
                >
                  Our Vision
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'story' ? 'active' : ''}`}
                  onClick={() => setActiveTab('story')}
                >
                  Our Story
                </button>
              </div>

              <div className="tab-pane-content">
                {activeTab === 'mission' && (
                  <div className="pane-fade-in">
                    <h3>Making events accessible to everyone, everywhere.</h3>
                    <p>Our mission is to democratize event organizing by delivering a state-of-the-art platform that eliminates ticketing hurdles, reduces overhead costs, and simplifies management tools for organizers of all sizes.</p>
                  </div>
                )}
                {activeTab === 'vision' && (
                  <div className="pane-fade-in">
                    <h3>To be the heartbeat of global community gatherings.</h3>
                    <p>We envision a world where anyone can turn an idea into an active gathering in seconds. By establishing trust and simplicity, we aim to power millions of community experiences worldwide.</p>
                  </div>
                )}
                {activeTab === 'story' && (
                  <div className="pane-fade-in">
                    <h3>Born out of a simple need for connection.</h3>
                    <p>GoEvent was started in 2025 by three event organizers who grew frustrated with bloated checkout flows, expensive ticket markups, and clunky check-in apps. We set out to build a sleek, developer-grade ticket manager and haven't looked back since.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="tabs-right">
              {/* Graphic stats dashboard */}
              <div className="stats-board-card">
                <div className="stats-card-header">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                  <span className="board-title">goevent-live-stats.json</span>
                </div>
                <div className="board-content">
                  <div className="stat-row">
                    <span className="stat-label">Events Hosted:</span>
                    <span className="stat-val highlight-purple">12,480+</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Tickets Distributed:</span>
                    <span className="stat-val highlight-blue">540,290+</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Active Host Accounts:</span>
                    <span className="stat-val highlight-green">3,200+</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Global Cities Covered:</span>
                    <span className="stat-val highlight-orange">180+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="about-values">
        <div className="container">
          <div className="center-header">
            <h2 className="section-title">Values That Guide Us</h2>
            <p className="section-subtitle">We design our technology and run our business around these core pillars.</p>
          </div>

          <div className="values-grid">
            {values.map((v, idx) => (
              <div className="value-card" key={idx} style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="value-icon-wrapper">
                  {v.icon}
                </div>
                <h3 className="value-title">{v.title}</h3>
                <p className="value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="about-team">
        <div className="container">
          <div className="center-header">
            <h2 className="section-title">Meet the Visionaries</h2>
            <p className="section-subtitle">The thinkers, developers, and creators backing GoEvent.</p>
          </div>

          <div className="team-grid">
            {teamMembers.map((member, idx) => (
              <div className="team-card" key={idx}>
                <div className="team-image-wrapper">
                  <img src={member.image} alt={member.name} className="team-image" />
                  <div className="team-overlay">
                    <div className="team-socials">
                      <a href={member.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
                        </svg>
                      </a>
                      <a href={member.twitter} target="_blank" rel="noreferrer" aria-label="Twitter">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="team-info">
                  <h3 className="team-name">{member.name}</h3>
                  <span className="team-role">{member.role}</span>
                  <p className="team-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-box">
            <h2 className="cta-title">Ready to Experience GoEvent?</h2>
            <p className="cta-desc">
              Whether you are looking to discover local meetups or scale your tickets to millions of clients, we have the tools you need.
            </p>
            <div className="cta-buttons">
              <a href="/GoEvent" className="btn-cta-primary">Explore Events</a>
              <a href="/GoEvent/signup" className="btn-cta-secondary">Create Account</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
