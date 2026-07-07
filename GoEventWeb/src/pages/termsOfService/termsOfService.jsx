import React, { useState } from 'react';
import NavBar from '../../components/navBar/navBar';
import SideBar from '../../components/sideBar/sideBar';
import Footer from '../../components/footer/footer';
import './termsOfService.css';

export default function TermsOfService({ isUserLoggedIn, setIsUserLoggedIn }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('sec1');

  const sections = [
    { id: 'sec1', title: '1. Acceptance of Terms', content: 'By accessing or using GoEvent, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.' },
    { id: 'sec2', title: '2. User Accounts', content: 'To access certain features of GoEvent, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.' },
    { id: 'sec3', title: '3. Ticket Purchase and Payments', content: 'All ticket sales on GoEvent are final unless specified otherwise by the event organizer. GoEvent acts as a ticketing platform and does not set refund policies. Payment processing services are provided by secure third-party processors.' },
    { id: 'sec4', title: '4. Event Content and Listings', content: 'Organizers are solely responsible for the accuracy and legality of the events they publish. GoEvent reserves the right to remove any event listing that violates our community standards, local laws, or policies.' },
    { id: 'sec5', title: '5. Prohibited Conduct', content: 'You agree not to use the service for any unlawful purpose, to transmit malicious code, to attempt unauthorized access to our servers, or to harass or disrupt other users.' },
    { id: 'sec6', title: '6. Limitation of Liability', content: 'To the maximum extent permitted by law, GoEvent shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.' },
    { id: 'sec7', title: '7. Changes to Terms', content: 'We reserve the right to modify these Terms of Service at any time. Changes will be posted on this page with an updated "Last Updated" date. Continued use of the platform constitutes acceptance of the new terms.' }
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="terms-wrapper">
      <NavBar
        isUserLoggedIn={isUserLoggedIn} setIsUserLoggedIn={setIsUserLoggedIn}
        onToggleSidebar={() => setSidebarOpen(true)}
        tag={"terms"}
      />

      <SideBar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isUserLoggedIn={isUserLoggedIn} setIsUserLoggedIn={setIsUserLoggedIn}
        tag={"terms"}
      />

      {/* Hero Section */}
      <section className="policy-hero">
        <div className="policy-hero-blur"></div>
        <div className="policy-hero-content">
          <span className="policy-badge">LEGAL</span>
          <h1 className="policy-hero-title">
            Terms of <span className="gradient-text">Service</span>
          </h1>
          <p className="policy-hero-subtitle">
            Last Updated: July 7, 2026. Please read these terms carefully before using GoEvent.
          </p>
        </div>
      </section>

      {/* Content Section with Sticky Sidebar navigation */}
      <section className="policy-content-section">
        <div className="container policy-container-grid">
          <aside className="policy-sidebar">
            <h4 className="sidebar-nav-title">Table of Contents</h4>
            <ul className="sidebar-nav-links">
              {sections.map((sec) => (
                <li key={sec.id}>
                  <button
                    className={`sidebar-nav-btn ${activeSection === sec.id ? 'active' : ''}`}
                    onClick={() => scrollToSection(sec.id)}
                  >
                    {sec.title.split('. ')[1] || sec.title}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <main className="policy-main-content">
            <div className="policy-intro-card">
              <h3>Welcome to GoEvent</h3>
              <p>
                These Terms of Service govern your use of the GoEvent website, services, and applications.
                By registering an account, purchasing tickets, or creating event listings, you agree to these terms in full.
              </p>
            </div>

            {sections.map((sec) => (
              <div key={sec.id} id={sec.id} className="policy-text-section">
                <h2>{sec.title}</h2>
                <p>{sec.content}</p>
              </div>
            ))}

            <div className="policy-contact-box">
              <h3>Have questions about our Terms?</h3>
              <p>Our support team is here to help clarify any details. Reach out to us via our contact page.</p>
              <a href="/GoEvent/contact" className="btn-policy-contact">Contact Support</a>
            </div>
          </main>
        </div>
      </section>

      <Footer />
    </div>
  );
}
