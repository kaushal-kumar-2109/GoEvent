import React, { useState, useEffect } from 'react';
import NavBar from '../../components/navBar/navBar';
import SideBar from '../../components/sideBar/sideBar';
import Footer from '../../components/footer/footer';
import { ToastSuccess, ToastError } from '../../assets/toast.jsx';
import { CheckUserAuth, RemoveUserAuth } from '../../middleware/chekUserAuth.jsx';
import './contactUs.css';

export default function ContactUs() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    setIsLoggedIn(CheckUserAuth());
    window.scrollTo(0, 0);
  }, []);

  const handleLogout = () => {
    RemoveUserAuth();
    setIsLoggedIn(false);
    ToastSuccess("Logout successfully");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      ToastError("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      ToastSuccess("Message sent successfully!");
      // Reset form fields
      setFormData({
        name: '',
        email: '',
        subject: 'general',
        message: ''
      });
    }, 1800);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How do I retrieve my purchased tickets?",
      a: "Once you purchase a ticket, you will receive a confirmation email with a unique QR code. Additionally, if you have a GoEvent account, you can find your tickets under the 'My Events' tab inside the profile dropdown."
    },
    {
      q: "What is the policy for ticket refunds?",
      a: "Refund policies are set by each individual event organizer. Generally, you can request a full refund up to 7 days before the event. To request a refund, please contact the organizer directly through the event details page."
    },
    {
      q: "Can I host both online and in-person events?",
      a: "Absolutely! When creating an event, you can specify whether it is in-person (by providing a physical address or venue) or virtual (by providing a stream link or video conference URL)."
    },
    {
      q: "How do I scan guest tickets at the door?",
      a: "Organizers can scan guest tickets directly using the GoEvent mobile app or by logging into their dashboard on a tablet. The ticket scanner uses the device camera to validate the unique QR code on each ticket instantly."
    }
  ];

  return (
    <div className="contact-wrapper">
      <NavBar
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onToggleSidebar={() => setSidebarOpen(true)}
        tag={"contact"}
      />

      <SideBar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        tag={"contact"}
      />

      {/* Hero Banner */}
      <section className="contact-hero">
        <div className="contact-hero-blur"></div>
        <div className="contact-hero-content">
          <span className="contact-badge">GET IN TOUCH</span>
          <h1 className="contact-hero-title">
            We'd Love to <span className="gradient-text-alt">Hear From You</span>
          </h1>
          <p className="contact-hero-subtitle">
            Have questions about hosting an event, booking tickets, or partnering with us? 
            Drop us a message and our support team will get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Form & Info Grid */}
      <section className="contact-content-section">
        <div className="container">
          <div className="contact-grid">
            
            {/* Contact Form Column */}
            <div className="contact-form-card">
              {submitSuccess ? (
                <div className="success-panel animate-scale-up">
                  <div className="success-icon-wrapper">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. A GoEvent support specialist will review your inquiry and follow up shortly.</p>
                  <button 
                    className="btn-send-another"
                    onClick={() => setSubmitSuccess(false)}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <h2 className="form-title">Send a Message</h2>
                  
                  <div className="form-group-row">
                    <div className="input-group">
                      <label htmlFor="name">Your Name *</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required 
                      />
                    </div>

                    <div className="input-group">
                      <label htmlFor="email">Your Email *</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        required 
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label htmlFor="subject">What can we help you with?</label>
                    <select 
                      id="subject" 
                      name="subject" 
                      value={formData.subject}
                      onChange={handleInputChange}
                    >
                      <option value="general">General Inquiry</option>
                      <option value="support">Ticket & Booking Support</option>
                      <option value="hosting">Event Hosting & Studio</option>
                      <option value="partner">Partnership Opportunities</option>
                      <option value="billing">Billing & Payouts</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label htmlFor="message">Your Message *</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows="6"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us details about your question..."
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className={`btn-form-submit ${isSubmitting ? 'submitting' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="submit-arrow">
                          <line x1="5" x2="19" y1="12" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Info Sidebar Column */}
            <div className="contact-info-column">
              
              {/* Info cards list */}
              <div className="info-cards-stack">
                
                <div className="info-item-card">
                  <div className="info-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div className="info-content">
                    <h4>Email Us</h4>
                    <p><a href="mailto:support@goevent.com" className="hover-link">support@goevent.com</a></p>
                    <p><a href="mailto:hello@goevent.com" className="hover-link">hello@goevent.com</a></p>
                  </div>
                </div>

                <div className="info-item-card">
                  <div className="info-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div className="info-content">
                    <h4>Call Us</h4>
                    <p><a href="tel:+15552345678" className="hover-link">+1 (555) 234-5678</a></p>
                    <p>Mon - Fri, 9am - 6pm EST</p>
                  </div>
                </div>

                <div className="info-item-card">
                  <div className="info-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className="info-content">
                    <h4>Headquarters</h4>
                    <p>100 Innovation Way, Suite 400</p>
                    <p>San Francisco, CA 94107</p>
                  </div>
                </div>

              </div>

              {/* Dynamic Mock Vector Map */}
              <div className="mock-map-container">
                <div className="map-overlay-title">goevent-hq-locator</div>
                <div className="map-graphics">
                  {/* Styled vector lines resembling map grids */}
                  <svg className="map-svg" width="100%" height="100%" viewBox="0 0 300 150">
                    <defs>
                      <linearGradient id="mapGridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#311042" stopOpacity="0.4" />
                      </linearGradient>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#mapGridGrad)" rx="8" />
                    
                    {/* Road networks */}
                    <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                    <line x1="80" y1="0" x2="80" y2="150" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                    <line x1="220" y1="0" x2="220" y2="150" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                    <path d="M0 120 C 100 120, 150 20, 300 20" fill="none" stroke="rgba(99, 102, 241, 0.15)" strokeWidth="3" />
                    
                    {/* Water body indicator */}
                    <path d="M250 100 Q 270 120 300 110 L 300 150 L 230 150 Z" fill="rgba(96, 165, 250, 0.08)" />

                    {/* Location pin indicator */}
                    <g className="map-pin-pulse">
                      <circle cx="150" cy="70" r="14" fill="rgba(192, 132, 252, 0.2)" />
                      <circle cx="150" cy="70" r="6" fill="#c084fc" />
                      <circle cx="150" cy="70" r="2" fill="#ffffff" />
                    </g>
                  </svg>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="contact-faq-section">
        <div className="container">
          <div className="center-header">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Quick answers to common inquiries before you contact support.</p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`faq-item-card ${openFaq === idx ? 'expanded' : ''}`}
                onClick={() => toggleFaq(idx)}
              >
                <div className="faq-question-bar">
                  <h3 className="faq-question">{faq.q}</h3>
                  <span className="faq-toggle-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" x2="12" y1="5" y2="19" />
                      <line x1="5" x2="19" y1="12" y2="12" />
                    </svg>
                  </span>
                </div>
                
                <div className="faq-answer-container">
                  <p className="faq-answer">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
