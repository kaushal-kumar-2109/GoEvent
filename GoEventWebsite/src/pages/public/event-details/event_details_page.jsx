import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GET_EVENT_DETAILS } from '../../../apis/sender';
import Loader from '../../../components/loader/loader';
import './event_details_page.css';

export default function EventDetailsPage() {
  const { eid } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoader, setIsLoader] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('about');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Fetch event details on mount
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoader(true);
        const response = await GET_EVENT_DETAILS({ eid });
        if (response && response.status === 200 && response.success && response.event) {
          setEvent(response.event);
          console.log(response.event);
          setActiveImage(response.event.bannerImage || response.event.thumbnailImage || '');
        } else {
          toast.error(response?.message || "Failed to load event details.");
        }
      } catch (error) {
        console.error("Error loading event details:", error);
        toast.error("Failed to load event details.");
      } finally {
        setIsLoader(false);
      }
    };

    if (eid) {
      fetchDetails();
    }
  }, [eid]);

  if (isLoader) {
    return <Loader />;
  }

  if (!event) {
    return (
      <div className="event-not-found container">
        <h2>Event Not Found</h2>
        <p>The requested event could not be found or you do not have permission to view it.</p>
        <a href="/GoEvent/events" className="btn btn-primary">Back to Events</a>
      </div>
    );
  }

  // Formatting helpers
  const formatDateRange = (start, end) => {
    if (!start || !end) return '';
    const s = new Date(start);
    const e = new Date(end);
    const startStr = s.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const endStr = e.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const startTime = s.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${startStr} - ${endStr} (Starts ${startTime})`;
  };

  const getCalendarDetails = (dateStr) => {
    if (!dateStr) return { month: '', day: '', weekday: '' };
    const d = new Date(dateStr);
    const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const day = d.getDate();
    const weekday = d.toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
    return { month, day, weekday };
  };

  const { month, day, weekday } = getCalendarDetails(event.startDate);

  // Status mapping
  const getStatusLabel = (status) => {
    switch (status) {
      case "PUBLISHED": return "New Event";
      case "PENDING": return "Registration Closed";
      case "STARTED": return "Live Event";
      case "COMPLETED": return "Event Ended";
      default: return status;
    }
  };

  const handleBooking = () => {
    if (event.status === "PENDING" || event.status === "COMPLETED") {
      toast.warning("Booking is closed for this event.");
      return;
    }
    if (quantity > event.availableSeats) {
      toast.warning("Not enough tickets available.");
      return;
    }
    toast.success(`Successfully booked ${quantity} ticket(s) for ${event.title}!`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.info("Event link copied to clipboard!");
  };

  // Highlights list
  const highlights = [
    "3 Days of Amazing Experience",
    "VIP Lounge Access & Catering",
    "Food Courts & Refreshments Available",
    "Games, Activities & Goodies",
    "International Artists & Industry Speakers",
    "Memorable Experiences and Networking"
  ];

  // Gallery images collection (main banner image + thumbnail + gallery)
  const allImages = Array.from(new Set([
    event.bannerImage,
    event.thumbnailImage,
    ...(event.galleryImages || [])
  ].filter(Boolean)));

  return (
    <div className="event-details-page-wrapper">
      <div className="container">
        
        {/* Breadcrumb Navigation */}
        <div className="breadcrumb-nav">
          <a href="/GoEvent">Home</a> &gt; <a href="/GoEvent/events">Events</a> &gt; <span>{event.category}</span> &gt; <span>{event.title}</span>
        </div>

        {/* Main Details Section: 2-Column Grid */}
        <div className="event-details-grid">
          
          {/* LEFT AREA: Media Gallery & Details */}
          <div className="event-details-main">
            
            {/* Image Viewer */}
            <div className="event-details-image-container">
              <img src={activeImage} alt={event.title} className="details-main-image" />
              <span className={`details-badge ${event.status.toLowerCase()}`}>{getStatusLabel(event.status)}</span>
            </div>

            {/* Gallery Thumbnail Bar */}
            {allImages.length > 1 && (
              <div className="details-thumbnails-bar">
                {allImages.map((imgUrl, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail-wrapper ${activeImage === imgUrl ? 'active' : ''}`}
                    onClick={() => setActiveImage(imgUrl)}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}

            {/* Mobile-Only Header Details */}
            <div className="mobile-event-header">
              <div className="summary-card-header">
                <div className="badge-date-box">
                  <span className="date-month">{month}</span>
                  <span className="date-day">{day}</span>
                  <span className="date-weekday">{weekday}</span>
                </div>
                
                <div className="summary-title-container">
                  <h2>{event.title}</h2>
                  <div className="summary-location-row">
                    <svg viewBox="0 0 24 24" width="14" height="14" className="loc-icon">
                      <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
                    </svg>
                    <span>{event.venueName || event.address}, {event.city}</span>
                  </div>
                  <div className="summary-likes-row">
                    <svg className="star-icon" viewBox="0 0 24 24" width="14" height="14">
                      <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" stroke="currentColor"></path>
                    </svg>
                    <span>{event.likes || 0} Likes</span>
                  </div>
                </div>
              </div>
              {event.shortDescription && (
                <p className="mobile-short-desc">{event.shortDescription}</p>
              )}
            </div>

            {/* Tabs Bar Navigation */}
            <div className="details-tabs-bar">
              <button className={`tab-link ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>About Event</button>
              {event.speakers && event.speakers.length > 0 && (
                <button className={`tab-link ${activeTab === 'speakers' ? 'active' : ''}`} onClick={() => setActiveTab('speakers')}>Speakers</button>
              )}
              <button className={`tab-link ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>Schedule</button>
              {event.galleryImages && event.galleryImages.length > 0 && (
                <button className={`tab-link ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => setActiveTab('gallery')}>Gallery</button>
              )}
              {event.faqs && event.faqs.length > 0 && (
                <button className={`tab-link ${activeTab === 'faq' ? 'active' : ''}`} onClick={() => setActiveTab('faq')}>FAQ</button>
              )}
              {event.comments && event.comments.length > 0 && (
                <button className={`tab-link ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews ({event.comments.length})</button>
              )}
              <button className={`tab-link ${activeTab === 'location' ? 'active' : ''}`} onClick={() => setActiveTab('location')}>Location</button>
            </div>

            {/* TAB CONTENTS CONTAINER */}
            <div className="details-tab-content">
              
              {/* TAB 1: About Event (With Video) */}
              {activeTab === 'about' && (
                <div className="tab-pane-about">
                  <div className="about-event-layout">
                    <div className="about-event-text">
                      <h3>About This Event</h3>
                      <p className="pane-description">{event.description}</p>
                      
                      <h4 className="highlights-title">Highlights</h4>
                      <div className="highlights-grid">
                        {highlights.map((highlight, index) => (
                          <div key={index} className="highlight-item">
                            <svg viewBox="0 0 24 24" width="16" height="16" className="checkmark-icon">
                              <polyline points="20 6 9 17 4 12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></polyline>
                            </svg>
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {event.promotionalVideo && (
                      <div className="about-event-video-container">
                        <h4 className="video-section-title">Promotional Video</h4>
                        <div className="video-wrapper">
                          <video 
                            src={event.promotionalVideo} 
                            controls 
                            poster={event.thumbnailImage || event.bannerImage}
                            className="event-promo-video"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Policies Section */}
                  {(event.refundPolicy || event.termsAndConditions) && (
                    <div className="event-policies-section">
                      {event.refundPolicy && (
                        <div className="policy-block">
                          <h4>Refund Policy</h4>
                          <p>{event.refundPolicy}</p>
                        </div>
                      )}
                      {event.termsAndConditions && (
                        <div className="policy-block">
                          <h4>Terms & Conditions</h4>
                          <p>{event.termsAndConditions}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Speakers */}
              {activeTab === 'speakers' && event.speakers && (
                <div className="tab-pane-speakers">
                  <h3>Speakers & Artists</h3>
                  <div className="speakers-grid">
                    {event.speakers.map((sp, idx) => (
                      <div key={idx} className="speaker-card">
                        <div className="speaker-avatar-container">
                          <img src={sp.image || "/avatar/user1.jpg"} alt={sp.name} className="speaker-avatar" />
                        </div>
                        <h4 className="speaker-name">{sp.name}</h4>
                        <p className="speaker-title">{sp.designation}</p>
                        <p className="speaker-company">{sp.company}</p>
                        {sp.bio && <p className="speaker-bio-short">{sp.bio}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: Schedule */}
              {activeTab === 'schedule' && (
                <div className="tab-pane-schedule">
                  <h3>Schedule Agenda</h3>
                  <div className="timeline-container">
                    <div className="timeline-day-header">Event Program Timeline</div>
                    
                    {event.schedule && event.schedule.length > 0 ? (
                      event.schedule.map((item, idx) => (
                        <div key={idx} className="timeline-item">
                          <div className="timeline-time">{item.time}</div>
                          <div className="timeline-content">
                            <h4>{item.event}</h4>
                            <p>{item.description}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="timeline-item">
                          <div className="timeline-time">10:00 AM</div>
                          <div className="timeline-content">
                            <h4>Gates Open & Registrations</h4>
                            <p>Welcome check-ins, security verification, badge collection, and initial entry.</p>
                          </div>
                        </div>

                        <div className="timeline-item">
                          <div className="timeline-time">11:00 AM</div>
                          <div className="timeline-content">
                            <h4>Opening Keynote Session</h4>
                            <p>Welcome speech, overview of the event topics, schedule, guidelines, and main kickoff.</p>
                          </div>
                        </div>

                        <div className="timeline-item">
                          <div className="timeline-time">01:00 PM</div>
                          <div className="timeline-content">
                            <h4>Lunch & Networking break</h4>
                            <p>Food courts and cafeteria options become available. Networking in the VIP lounge.</p>
                          </div>
                        </div>

                        <div className="timeline-item">
                          <div className="timeline-time">03:00 PM</div>
                          <div className="timeline-content">
                            <h4>Special Performance & Panel discussion</h4>
                            <p>Guest speakers convene for interactive workshops, Q&A sessions, and panels.</p>
                          </div>
                        </div>

                        <div className="timeline-item">
                          <div className="timeline-time">06:00 PM</div>
                          <div className="timeline-content">
                            <h4>Main Headliner Event</h4>
                            <p>Main performance stage events, central talks, live interactive shows, and festival acts.</p>
                          </div>
                        </div>

                        <div className="timeline-item">
                          <div className="timeline-time">08:00 PM</div>
                          <div className="timeline-content">
                            <h4>Closing Ceremony</h4>
                            <p>Ending notes, giveaways, networking closure, and gate clearance.</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: Gallery */}
              {activeTab === 'gallery' && event.galleryImages && (
                <div className="tab-pane-gallery">
                  <h3>Gallery Photos</h3>
                  <div className="gallery-grid">
                    {event.galleryImages.map((img, idx) => (
                      <div key={idx} className="gallery-item" onClick={() => setActiveImage(img)}>
                        <img src={img} alt={`Gallery ${idx + 1}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: FAQ Accordion */}
              {activeTab === 'faq' && event.faqs && (
                <div className="tab-pane-faq">
                  <h3>Frequently Asked Questions</h3>
                  <div className="faq-list">
                    {event.faqs.map((faq, idx) => (
                      <div key={idx} className={`faq-item ${openFaqIndex === idx ? 'open' : ''}`}>
                        <div className="faq-question-header" onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}>
                          <h4>{faq.question}</h4>
                          <span className="faq-chevron">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </span>
                        </div>
                        {openFaqIndex === idx && (
                          <div className="faq-answer-content">
                            <p>{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: Reviews */}
              {activeTab === 'reviews' && event.comments && (
                <div className="tab-pane-reviews">
                  <h3>User Comments ({event.comments.length})</h3>
                  <div className="comments-list">
                    {event.comments.map((comment, idx) => (
                      <div key={idx} className="user-comment-card">
                        <div className="comment-user-info">
                          <span className="comment-user-avatar">{comment.name ? comment.name.charAt(0).toUpperCase() : 'U'}</span>
                          <div className="comment-user-details">
                            <h4 className="comment-user-name">{comment.name || 'Anonymous User'}</h4>
                            <span className="comment-user-email">{comment.email}</span>
                          </div>
                        </div>
                        <p className="comment-text">"{comment.comment}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: Location map and details */}
              {activeTab === 'location' && (
                <div className="tab-pane-location">
                  <h3>Venue & Location Details</h3>
                  <div className="location-details-container">
                    <div className="location-text-info">
                      <h4>{event.venueName || 'Venue'}</h4>
                      <p className="location-address">{event.address}</p>
                      <p className="location-city-state">{event.city}, {event.state} - {event.pincode}</p>
                      <p className="location-country">{event.country}</p>
                      {event.googleMapsLink && (
                        <a href={event.googleMapsLink} target="_blank" rel="noopener noreferrer" className="btn btn-secondary maps-link-btn">
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
                          </svg>
                          Open in Google Maps
                        </a>
                      )}
                    </div>
                    <div className="location-map-mock">
                      <iframe 
                        title="Event Location Map"
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(event.address + ' ' + event.city)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                        width="100%" 
                        height="250" 
                        style={{ border: 0, borderRadius: 'var(--radius-md)' }} 
                        allowFullScreen="" 
                        loading="lazy"
                      ></iframe>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR: Event Information & Ticket Widget */}
          <aside className="event-details-sidebar">
            
            {/* Summary Details Widget Card */}
            <div className="sidebar-summary-card">
              <div className="summary-card-header">
                {/* Date Square Badge */}
                <div className="badge-date-box">
                  <span className="date-month">{month}</span>
                  <span className="date-day">{day}</span>
                  <span className="date-weekday">{weekday}</span>
                </div>
                
                <div className="summary-title-container">
                  <h2>{event.title}</h2>
                  <div className="summary-location-row">
                    <svg viewBox="0 0 24 24" width="14" height="14" className="loc-icon">
                      <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
                    </svg>
                    <span>{event.venueName || event.address}, {event.city}</span>
                  </div>
                  <div className="summary-likes-row">
                    <svg className="star-icon" viewBox="0 0 24 24" width="14" height="14">
                      <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" stroke="currentColor"></path>
                    </svg>
                    <span>{event.likes || 0} Likes</span>
                  </div>
                </div>
              </div>

              {/* Grid Metadata details */}
              <div className="summary-details-grid">
                <div className="details-grid-item">
                  <span className="item-label">Date & Time</span>
                  <span className="item-value">{formatDateRange(event.startDate, event.endDate)}</span>
                </div>
                <div className="details-grid-item">
                  <span className="item-label">Category</span>
                  <span className="item-value">{event.category}</span>
                </div>
                <div className="details-grid-item">
                  <span className="item-label">Organizer Name</span>
                  <span className="item-value">{event.organizerName || 'GoEvent Organizer'}</span>
                </div>
                <div className="details-grid-item">
                  <span className="item-label">Event Type</span>
                  <span className="item-value">{event.eventType} Event</span>
                </div>
                <div className="details-grid-item">
                  <span className="item-label">Total Seats</span>
                  <span className="item-value">{event.totalSeats || 0} Seats</span>
                </div>
                <div className="details-grid-item">
                  <span className="item-label">Available Seats</span>
                  <span className="item-value">{event.availableSeats || 0} Seats</span>
                </div>
              </div>
            </div>

            {/* Booking Card Purchase Panel */}
            <div className="sidebar-booking-card">
              <div className="booking-price-header">
                <span className="booking-price-lbl">Starting From</span>
                <h3 className="booking-price-val">₹ {event.ticketPrice}</h3>
              </div>

              {/* Quantity Counter */}
              <div className="booking-quantity-group">
                <span className="qty-label">Quantity</span>
                <div className="quantity-counter">
                  <button 
                    disabled={quantity <= 1} 
                    onClick={() => setQuantity(prev => prev - 1)}
                  >
                    -
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button 
                    disabled={quantity >= (event.availableSeats || 10)} 
                    onClick={() => setQuantity(prev => prev + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Booking Actions */}
              <button 
                className="btn btn-primary booking-submit-btn" 
                onClick={handleBooking}
                disabled={event.status === "PENDING" || event.status === "COMPLETED"}
              >
                {event.status === "PENDING" || event.status === "COMPLETED" ? "Booking Closed" : "Book Now"}
              </button>

              <button className="btn btn-secondary add-wishlist-btn">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                </svg>
                Add to Wishlist
              </button>

              {/* Trust labels checklist */}
              <div className="booking-trust-labels">
                <div className="trust-item">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <span>Secure Checkout</span>
                </div>
                <div className="trust-item">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Instant Confirmation</span>
                </div>
                <div className="trust-item">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  <span>24/7 Customer Support</span>
                </div>
              </div>
            </div>

            {/* Organizer Details Card */}
            <div className="sidebar-summary-card">
              <div className="summary-card-header">
                <span className="comment-user-avatar" style={{ width: '48px', height: '48px', fontSize: '18px' }}>
                  {event.organizerName ? event.organizerName.charAt(0).toUpperCase() : 'O'}
                </span>
                <div className="summary-title-container">
                  <span className="item-label">Event Organizer</span>
                  <h4 className="organizer-name" style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-color)' }}>
                    {event.organizerName || 'GoEvent Organizer'}
                  </h4>
                  {event.website && (
                    <a href={event.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: 'var(--primary-color)' }}>
                      Visit Website
                    </a>
                  )}
                </div>
              </div>

              {/* Event Social Links */}
              {event.socialLinks && (
                <div className="social-share-links" style={{ justifyContent: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                  {event.socialLinks.facebook && (
                    <a href={event.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="share-btn-round" title="Facebook">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"></path></svg>
                    </a>
                  )}
                  {event.socialLinks.twitter && (
                    <a href={event.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="share-btn-round" title="Twitter/X">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                    </a>
                  )}
                  {event.socialLinks.instagram && (
                    <a href={event.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="share-btn-round" title="Instagram">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"></path></svg>
                    </a>
                  )}
                  {event.socialLinks.linkedin && (
                    <a href={event.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="share-btn-round" title="LinkedIn">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
                    </a>
                  )}
                  {event.socialLinks.youtube && (
                    <a href={event.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="share-btn-round" title="YouTube">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.528 3.545 12 3.545 12 3.545s-7.528 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.023 0 12 0 12s0 3.977.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.86.508 9.388.508 9.388.508s7.528 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.977 24 12 24 12s0-3.977-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path></svg>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Sharing Block Widget */}
            <div className="sidebar-share-card">
              <h4>Share this event</h4>
              <div className="social-share-links">
                <button className="share-btn-round copy-link" onClick={handleCopyLink} title="Copy Link">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                </button>
                
                <a href="https://wa.me/?text=Check out this amazing event!" target="_blank" rel="noopener noreferrer" className="share-btn-round whatsapp" title="Share on WhatsApp">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M19.05 4.91A9.82 9.82 0 0 0 12.03 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.83 9.83 0 0 0 4.73 1.22v-.002c5.46 0 9.91-4.45 9.91-9.91a9.83 9.83 0 0 0-2.89-7.025zm-7.02 15.14c-1.54 0-3.05-.41-4.38-1.2l-.31-.19-3.26.85.87-3.18-.21-.33a8.2 8.2 0 0 1-1.25-4.29c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-1.13-.56-1.92-1.03-2.69-2.35-.2-.35-.2-.55-.07-.68.12-.12.25-.29.38-.43.13-.14.17-.23.25-.39.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.49-.4-.42-.56-.43-.14 0-.31-.02-.47-.02-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1 2.54.12.17 1.75 2.67 4.23 3.74.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.47-.28z"></path>
                  </svg>
                </a>

                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="share-btn-round facebook" title="Share on Facebook">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"></path>
                  </svg>
                </a>

                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="share-btn-round linkedin" title="Share on LinkedIn">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                  </svg>
                </a>
              </div>
            </div>

            {/* Questions Card */}
            <div className="sidebar-questions-card">
              <h4>Have Questions?</h4>
              <p>Get in touch with the organizer if you have doubts.</p>
              <a href={`mailto:${event.contactEmail || 'support@goevent.com'}`} className="btn btn-secondary contact-btn">
                Contact Organizer
              </a>
            </div>
          </aside>
          
        </div>
      </div>

      {/* Sticky Mobile Booking Bottom Bar */}
      <div className="mobile-sticky-booking-bar">
        <div className="sticky-price-info">
          <span className="sticky-lbl">Starting From</span>
          <span className="sticky-val">₹{event.ticketPrice}</span>
        </div>
        
        <div className="sticky-actions">
          <div className="quantity-counter sticky-counter">
            <button 
              disabled={quantity <= 1} 
              onClick={() => setQuantity(prev => prev - 1)}
            >
              -
            </button>
            <span className="qty-value">{quantity}</span>
            <button 
              disabled={quantity >= (event.availableSeats || 10)} 
              onClick={() => setQuantity(prev => prev + 1)}
            >
              +
            </button>
          </div>
          
          <button 
            className="btn btn-primary sticky-book-btn" 
            onClick={handleBooking}
            disabled={event.status === "PENDING" || event.status === "COMPLETED"}
          >
            {event.status === "PENDING" || event.status === "COMPLETED" ? "Closed" : "Book Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
