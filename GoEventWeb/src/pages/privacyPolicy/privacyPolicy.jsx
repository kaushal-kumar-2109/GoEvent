import React, { useState } from 'react';
import NavBar from '../../components/navBar/navBar';
import SideBar from '../../components/sideBar/sideBar';
import Footer from '../../components/footer/footer';
import './privacyPolicy.css';

export default function PrivacyPolicy({ isUserLoggedIn, setIsUserLoggedIn }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('sec1');

  const sections = [
    { id: 'sec1', title: '1. Information We Collect', content: 'We collect information you provide directly to us when you create an account, purchase tickets, customize your profile, or communicate with us. This includes your name, email address, phone number, and payment information.' },
    { id: 'sec2', title: '2. How We Use Information', content: 'We use the collected information to facilitate ticket purchases, manage event hosting, personalize user experiences, verify organizer accounts, prevent fraudulent actions, and send service updates.' },
    { id: 'sec3', title: '3. Sharing and Disclosing Information', content: 'We share necessary ticketing details with organizers of events you register for. We also share data with secure payment processors (such as Stripe) to process transactions. We never sell your personal data to third parties.' },
    { id: 'sec4', title: '4. Data Retention and Security', content: 'We retain your personal data only as long as necessary to provide services and comply with legal requirements. We use advanced encryption and industry-standard security practices to protect your data.' },
    { id: 'sec5', title: '5. Your Rights and Choices', content: 'Depending on your jurisdiction, you have the right to access, correct, delete, or export your personal information. You can manage email communication preferences in your profile and control cookies using our Cookie Preferences panel.' },
    { id: 'sec6', title: '6. International Data Transfers', content: 'GoEvent operates globally, and your information may be processed in servers located outside your home country. We implement proper legal safeguards to ensure safety compliance during data transfers.' },
    { id: 'sec7', title: '7. Updates to This Policy', content: 'We may modify this privacy policy periodically to reflect operational, legal, or regulatory updates. We will notify you of any material changes by posting the new policy on this page.' }
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="privacy-wrapper">
      <NavBar
        isUserLoggedIn={isUserLoggedIn} setIsUserLoggedIn={setIsUserLoggedIn}
        onToggleSidebar={() => setSidebarOpen(true)}
        tag={"privacy"}
      />

      <SideBar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isUserLoggedIn={isUserLoggedIn} setIsUserLoggedIn={setIsUserLoggedIn}
        tag={"privacy"}
      />

      {/* Hero Section */}
      <section className="policy-hero">
        <div className="policy-hero-blur"></div>
        <div className="policy-hero-content">
          <span className="policy-badge">PRIVACY</span>
          <h1 className="policy-hero-title">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="policy-hero-subtitle">
            Last Updated: July 7, 2026. Your privacy and data security are of core importance to us.
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
              <h3>Our Privacy Commitment</h3>
              <p>
                At GoEvent, we are dedicated to protecting your personal information. This Privacy Policy details 
                how we collect, use, and protect your information when you use our event ticketing and organizing ecosystem.
              </p>
            </div>

            {sections.map((sec) => (
              <div key={sec.id} id={sec.id} className="policy-text-section">
                <h2>{sec.title}</h2>
                <p>{sec.content}</p>
              </div>
            ))}

            <div className="policy-contact-box">
              <h3>Questions about your personal data?</h3>
              <p>You can contact our Data Protection Officer for inquiries related to your rights and details.</p>
              <a href="/GoEvent/contact" className="btn-policy-contact">Contact DPO</a>
            </div>
          </main>
        </div>
      </section>

      <Footer />
    </div>
  );
}
