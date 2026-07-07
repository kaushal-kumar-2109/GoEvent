import React, { useState, useEffect } from 'react';
import NavBar from '../../components/navBar/navBar';
import SideBar from '../../components/sideBar/sideBar';
import Footer from '../../components/footer/footer';
import { ToastSuccess } from '../../assets/toast.jsx';
import './cookiePreferences.css';

export default function CookiePreferences({ isUserLoggedIn, setIsUserLoggedIn }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // States for cookie choices
  const [preferences, setPreferences] = useState({
    essential: true, // Always true/disabled
    functional: true,
    analytics: false,
    marketing: false
  });

  // Load preferences from localStorage on load
  useEffect(() => {
    const savedPreferences = localStorage.getItem('goevent-cookie-preferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences({
          essential: true, // Always ensure essential is true
          functional: parsed.functional ?? true,
          analytics: parsed.analytics ?? false,
          marketing: parsed.marketing ?? false
        });
      } catch (e) {
        console.error("Error parsing saved cookie preferences", e);
      }
    }
  }, []);

  const handleToggle = (key) => {
    if (key === 'essential') return; // Cannot toggle essential cookies
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    localStorage.setItem('goevent-cookie-preferences', JSON.stringify(preferences));
    ToastSuccess("Cookie preferences updated successfully!");
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true
    };
    setPreferences(allAccepted);
    localStorage.setItem('goevent-cookie-preferences', JSON.stringify(allAccepted));
    ToastSuccess("All cookies accepted successfully!");
  };

  const cookieTypes = [
    {
      key: 'essential',
      title: 'Essential Cookies',
      required: true,
      desc: 'These cookies are absolutely necessary to provide you with services available through our site and to use some of its features, such as secure login areas, QR ticket scanning, and layout preservation.',
      examples: 'Session identifiers, authentication tokens, security and fraud prevention cookies.'
    },
    {
      key: 'functional',
      title: 'Functional Cookies',
      required: false,
      desc: 'These cookies allow our website to remember choices you make (such as language selection, custom settings, or theme choices) and provide enhanced, more personal features.',
      examples: 'Theme selector preference, local timezone alignment, search filters preference.'
    },
    {
      key: 'analytics',
      title: 'Analytics & Performance Cookies',
      required: false,
      desc: 'These cookies are used to collect information about traffic to our site and how users use the site. The information does not identify any individual visitor. It helps us run, maintain, and improve our services.',
      examples: 'Google Analytics, user behavior patterns mapping, load balancer statistics.'
    },
    {
      key: 'marketing',
      title: 'Marketing & Target Cookies',
      required: false,
      desc: 'These cookies are used to deliver advertisements more relevant to you and your interests. They are also used to limit the number of times you see an advertisement as well as help measure the effectiveness of advertising campaigns.',
      examples: 'Retargeting pixel tracking, custom recommendation engine identifiers.'
    }
  ];

  return (
    <div className="cookies-wrapper">
      <NavBar
        isUserLoggedIn={isUserLoggedIn} setIsUserLoggedIn={setIsUserLoggedIn}
        onToggleSidebar={() => setSidebarOpen(true)}
        tag={"cookies"}
      />

      <SideBar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isUserLoggedIn={isUserLoggedIn} setIsUserLoggedIn={setIsUserLoggedIn}
        tag={"cookies"}
      />

      {/* Hero Section */}
      <section className="cookies-hero">
        <div className="cookies-hero-blur"></div>
        <div className="cookies-hero-content">
          <span className="cookies-badge">PREFERENCES</span>
          <h1 className="cookies-hero-title">
            Cookie <span className="gradient-text">Preferences</span>
          </h1>
          <p className="cookies-hero-subtitle">
            Manage your cookie settings. We use cookies to enhance navigation, deliver tailored events, and analyze performance.
          </p>
        </div>
      </section>

      {/* Preferences Panel */}
      <section className="cookies-panel-section">
        <div className="container cookies-container-narrow">
          <div className="cookies-consent-card">
            <div className="consent-card-header">
              <h2>Customize Settings</h2>
              <p>Toggle individual cookie classes below to manage details stored on your browser.</p>
            </div>

            <div className="cookie-types-list">
              {cookieTypes.map((type) => (
                <div key={type.key} className="cookie-type-item">
                  <div className="cookie-type-header">
                    <div className="cookie-type-info">
                      <h3>
                        {type.title}
                        {type.required && <span className="required-badge">Required</span>}
                      </h3>
                      <p className="cookie-desc">{type.desc}</p>
                    </div>

                    <div className="cookie-toggle-control">
                      <label className={`switch ${type.required ? 'disabled' : ''}`}>
                        <input
                          type="checkbox"
                          checked={preferences[type.key]}
                          disabled={type.required}
                          onChange={() => handleToggle(type.key)}
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </div>
                  <div className="cookie-examples">
                    <strong>Examples: </strong> {type.examples}
                  </div>
                </div>
              ))}
            </div>

            <div className="cookies-actions">
              <button className="btn-cookies-secondary" onClick={handleSave}>
                Save Preferences
              </button>
              <button className="btn-cookies-primary" onClick={handleAcceptAll}>
                Accept All Cookies
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
