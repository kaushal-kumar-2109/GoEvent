import React, { useState } from 'react';
import { ToastSuccess } from '../../../utils/toast_notification';

export default function HelpSupportTab({ theme }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [contactForm, setContactForm] = useState({
    subject: 'Booking issue',
    message: ''
  });

  const faqs = [
    {
      id: 1,
      question: 'How do I book a ticket for an event?',
      answer: 'Go to the Events tab, select the event you wish to attend, click on the event to view details, then click "Book Tickets". Choose your ticket quantity and proceed to checkout to complete your transaction.'
    },
    {
      id: 2,
      question: 'What is the refund policy for cancelled bookings?',
      answer: 'If an event is cancelled by the organizer, a full refund will be automatically processed to your original payment method within 5-7 working days. If you cancel your booking, the refund depends on the organizer’s specific event policy.'
    },
    {
      id: 3,
      question: 'How can I host my own event on GoEvent?',
      answer: 'You can host events by switching your account type to "Host" in settings. Once activated, click on "Create New Event" on your dashboard and fill out the event title, category, date, tickets, and location details.'
    },
    {
      id: 4,
      question: 'How do I verify my KYC status?',
      answer: 'KYC verification requires uploading a valid government identification document (like a Pan Card or Aadhaar Card) under the Account Status section. Our compliance team usually reviews and approves it within 24 hours.'
    }
  ];

  const handleToggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    ToastSuccess("Support request submitted! We will contact you soon.", theme);
    setContactForm({
      subject: 'Booking issue',
      message: ''
    });
  };

  return (
    <div className="help-support-tab-container">
      <div className="tab-header-row">
        <div>
          <h2 className="tab-title">Help & Support</h2>
          <p className="tab-subtitle">Browse frequently asked questions or submit an inquiry to our help desk</p>
        </div>
      </div>

      <div className="support-layout-grid">
        
        {/* Left Column: FAQ Accordion */}
        <div className="support-left-col">
          <div className="profile-card faq-section-card">
            <h3 className="card-title">Frequently Asked Questions</h3>
            <div className="faq-list">
              {faqs.map(faq => (
                <div key={faq.id} className={`faq-item ${openFaq === faq.id ? 'open' : ''}`}>
                  <button 
                    type="button" 
                    className="faq-question-btn"
                    onClick={() => handleToggleFaq(faq.id)}
                  >
                    <span>{faq.question}</span>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" className="chevron-icon">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  {openFaq === faq.id && (
                    <div className="faq-answer-container">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form & Info */}
        <div className="support-right-col">
          
          {/* Card: Contact Support */}
          <form onSubmit={handleFormSubmit} className="profile-card contact-form-card">
            <h3 className="card-title">Contact Support</h3>
            <div className="form-group mb-4">
              <label htmlFor="subject" className="form-label">Subject</label>
              <select
                id="subject"
                name="subject"
                value={contactForm.subject}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="Booking issue">Booking Issue</option>
                <option value="Payment issue">Payment & Refunds</option>
                <option value="Account verification">KYC & Account Verification</option>
                <option value="Host query">Organizer/Hosting Query</option>
                <option value="Other">Other General Query</option>
              </select>
            </div>

            <div className="form-group mb-4">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea
                id="message"
                name="message"
                value={contactForm.message}
                onChange={handleInputChange}
                className="form-input form-textarea"
                placeholder="Describe your issue in detail..."
                rows="4"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Submit Ticket
            </button>
          </form>

          {/* Card: Helpline Info */}
          <div className="profile-card support-info-card">
            <h3 className="card-title">Helpline & Details</h3>
            <div className="contact-details-list">
              <div className="contact-detail-item">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <div className="detail-meta">
                  <span className="detail-label">Email Support</span>
                  <a href="mailto:support@goevent.com" className="detail-val">support@goevent.com</a>
                </div>
              </div>

              <div className="contact-detail-item">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <div className="detail-meta">
                  <span className="detail-label">Toll-Free Phone</span>
                  <span className="detail-val">1800-419-5566</span>
                </div>
              </div>

              <div className="contact-detail-item">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <div className="detail-meta">
                  <span className="detail-label">Working Hours</span>
                  <span className="detail-val">Mon - Sat: 9:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
