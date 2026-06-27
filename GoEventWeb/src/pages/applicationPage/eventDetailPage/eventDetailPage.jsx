import { useState, useEffect } from 'react';
import { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '../../../components/navBar/navBar';
import SideBar from '../../../components/sideBar/sideBar';
import Footer from '../../../components/footer/footer';
import Loader from '../../../components/loader/loader';
import { getEventById } from '../../../api/getApiHandler/getData';
import { ToastMessage, ToastSuccess } from '../../../assets/toast.jsx';
import { useNavigate } from 'react-router-dom';
import './eventDetailPage.css';
import { CheckUserAuth } from '../../../middleware/chekUserAuth.jsx';

export default function EventDetailPage() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [eventData, setEventData] = useState(null);

  // Interactive page states
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsList, setCommentsList] = useState([]);
  const [newComment, setNewComment] = useState({ name: '', email: '', comment: '' });

  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const handlePlayClick = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const navigate = useNavigate();

  const CheckAuth = async () => {
    const isUserValid = await CheckUserAuth();
    if (!isUserValid) {
      navigate("/GoEvent/login");
    }
  }

  const loadEvent = async () => {
    setIsLoading(true);
    try {
      const res = await getEventById(id);
      if (res && res.flag && res.data && res.data.data) {
        const data = res.data.data;
        console.log(data);
        setEventData(data);
        setLikesCount(data.likes || 0);
        setCommentsList(data.comments || []);
      } else {
        console.warn("API fetched failed or returned no data, falling back to mock details.");
        setEventData(MOCK_EVENT);
        setLikesCount(MOCK_EVENT.likes);
        setCommentsList(MOCK_EVENT.comments);
        ToastMessage("Using demo event info");
      }
      setIsLoading(false);
    } catch (err) {
      console.error("Error loading event: ", err);
      if (active) {
        setEventData(MOCK_EVENT);
        setLikesCount(MOCK_EVENT.likes);
        setCommentsList(MOCK_EVENT.comments);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    CheckAuth();
    loadEvent();
  }, []);

  const handleLikeToggle = () => {
    if (isLiked) {
      setLikesCount(prev => prev - 1);
      setIsLiked(false);
      ToastSuccess("Removed from favorites");
    } else {
      setLikesCount(prev => prev + 1);
      setIsLiked(true);
      ToastSuccess("Added to favorites!");
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.name.trim() || !newComment.email.trim() || !newComment.comment.trim()) {
      ToastMessage("Please fill in all comment fields");
      return;
    }
    const updatedComments = [
      ...commentsList,
      {
        name: newComment.name,
        email: newComment.email,
        comment: newComment.comment,
        createdAt: new Date().toISOString()
      }
    ];
    setCommentsList(updatedComments);
    setNewComment({ name: '', email: '', comment: '' });
    ToastSuccess("Comment added successfully!");
  };

  const toggleFaq = (index) => {
    setActiveFaqIndex(activeFaqIndex === index ? null : index);
  };

  if (isLoading) {
    return <Loader text="Fetching Event Details..." />;
  }

  if (!eventData) {
    return (
      <div className="event-detail-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <h2>Event Not Found</h2>
        <p style={{ color: '#94a3b8', margin: '1rem 0' }}>The event you are looking for does not exist or has been removed.</p>
        <Link to="/GoEvent" className="btn-explore" style={{ textDecoration: 'none' }}>Return Home</Link>
      </div>
    );
  }

  const {
    title, shortDescription,
    description, category, organizerName, bannerImage, eventMode, venueName, address, city, state, country,
    pincode, googleMapsLink, meetingLink, meetingPassword, startDate, endDate, registrationDeadline,
    ticketPrice, availableSeats, contactEmail, contactPhone, website, socialLinks, speakers, faqs,
    refundPolicy, termsAndConditions, galleryImages, promotionalVideo, registrationCount
  } = eventData;

  const totalSeats = (availableSeats || 0) + (registrationCount || 0);
  const percentFilled = totalSeats > 0 ? Math.min(100, Math.round(((registrationCount || 0) / totalSeats) * 100)) : 0;

  // Format Dates
  const formattedStart = new Date(startDate).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
  const formattedEnd = new Date(endDate).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
  const formattedDeadline = new Date(registrationDeadline).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
  return (
    <div className="event-detail-wrapper">
      <NavBar
        isLoggedIn={isLoggedIn}
        onLogout={() => setIsLoggedIn(false)}
        onToggleSidebar={() => setSidebarOpen(true)}
        tag={"none"}
      />

      <SideBar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isLoggedIn={isLoggedIn}
        onLogout={() => setIsLoggedIn(false)}
        tag={"none"}
      />

      {/* Hero Banner Section */}
      <header className="event-hero-banner" style={{ backgroundImage: `url('${bannerImage}')` }}>
        <div className="event-hero-overlay"></div>
        <div className="event-hero-container">
          <div className="event-category-tag">{category || "General"}</div>
          <h1 className="event-title-main">{title}</h1>
          <div className="event-hero-meta">
            <div className="event-meta-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>{new Date(startDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="event-meta-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{city}, {state}, {country}</span>
            </div>
            <div className="event-meta-item">
              <span className="event-category-tag" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                Mode: {eventMode}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="event-detail-grid">

        {/* Left Content */}
        <section className="event-content-left">

          {/* About Event Card */}
          <div className="detail-section-card">
            <h2 className="section-card-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10" /><path d="M6 10h10" />
              </svg>
              About the Event
            </h2>
            {shortDescription && <p className="event-short-desc">{shortDescription}</p>}
            <p className="event-long-desc">{description}</p>

            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.01)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
              <div style={{ background: '#6366f1', color: '#fff', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                {organizerName ? organizerName.charAt(0) : 'O'}
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Hosted By</div>
                <div style={{ fontSize: '1rem', color: '#ffffff', fontWeight: '700' }}>{organizerName || "Organizer"}</div>
              </div>
            </div>
          </div>

          {/* Speakers Section */}
          {speakers && speakers.length > 0 && (
            <div className="detail-section-card">
              <h2 className="section-card-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Event Speakers
              </h2>
              <div className="speakers-grid">
                {speakers.map((speaker, index) => (
                  <div key={index} className="speaker-card">
                    <img src={speaker.image || "https://picsum.photos/200/200?random=" + index} alt={speaker.name} className="speaker-avatar" />
                    <h3 className="speaker-name">{speaker.name}</h3>
                    <div className="speaker-title">{speaker.designation}</div>
                    <div className="speaker-company">{speaker.company}</div>
                    {speaker.bio && <p className="speaker-bio">{speaker.bio}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Promo Video Section */}
          {promotionalVideo && (
            <div className="detail-section-card">
              <h2 className="section-card-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m22 8-6 4 6 4V8Z" />
                  <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
                </svg>
                Promotional Video
              </h2>
              <div className="video-preview-wrapper">
                <div className="video-placeholder-container">
                  <div className='promotional-video'>
                    <video
                      ref={videoRef}
                      src={`${promotionalVideo}`}
                      controls={isPlaying} // Shows native controls only after clicking play
                      preload="metadata"
                    />                  </div>
                  <div className="play-button-icon" onClick={() => handlePlayClick}>
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                  {(!isPlaying) && (
                    <>
                      <h3>Watch Video Trailer</h3>
                      <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem', maxWidth: '380px' }}>
                        Get a quick sneak peek of what the speakers and workshops have lined up for you.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Media / Gallery Images Section */}
          {galleryImages && galleryImages.length > 0 && (
            <div className="detail-section-card">
              <h2 className="section-card-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                Event Gallery
              </h2>
              <div className="gallery-grid">
                {galleryImages.map((imgUrl, index) => (
                  <div key={index} className="gallery-item" onClick={() => alert("Viewing photo in high resolution.")}>
                    <img src={imgUrl} alt={`Gallery view ${index + 1}`} className="gallery-image" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQs Section */}
          {faqs && faqs.length > 0 && (
            <div className="detail-section-card">
              <h2 className="section-card-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Frequently Asked Questions
              </h2>
              <div className="faq-accordion">
                {faqs.map((faq, index) => (
                  <div key={index} className={`faq-item ${activeFaqIndex === index ? 'active' : ''}`}>
                    <button className="faq-header" onClick={() => toggleFaq(index)}>
                      <span>{faq.question}</span>
                      <span className="faq-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </button>
                    {activeFaqIndex === index && (
                      <div className="faq-body">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Policies Section */}
          <div className="detail-section-card">
            <h2 className="section-card-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Policies & Terms
            </h2>
            <div className="policy-box-container">
              {refundPolicy && (
                <div className="policy-block-card">
                  <h3 className="policy-block-title">Refund Policy</h3>
                  <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.6' }}>{refundPolicy}</p>
                </div>
              )}
              {termsAndConditions && (
                <div className="policy-block-card">
                  <h3 className="policy-block-title">Terms & Conditions</h3>
                  <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.6' }}>{termsAndConditions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Reviews and Comments Section */}
          <div className="detail-section-card">
            <h2 className="section-card-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Comments & Discussion ({commentsList.length})
            </h2>
            <div className="reviews-section">
              <div className="reviews-list">
                {commentsList.map((c, i) => (
                  <div key={i} className="review-item">
                    <div className="review-header">
                      <span className="review-author">{c.name}</span>
                      {c.createdAt && <span className="review-date">{new Date(c.createdAt).toLocaleDateString()}</span>}
                    </div>
                    <p className="review-text">{c.comment}</p>
                  </div>
                ))}
                {commentsList.length === 0 && (
                  <p style={{ color: '#64748b', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
                    No comments yet. Start the conversation below!
                  </p>
                )}
              </div>

              {/* Comment submission form */}
              <form className="comment-form" onSubmit={handleCommentSubmit}>
                <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: '600' }}>Leave a comment</h4>
                <div className="comment-inputs-row">
                  <input
                    type="text"
                    className="comment-input"
                    placeholder="Your Name"
                    value={newComment.name}
                    onChange={(e) => setNewComment(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  <input
                    type="email"
                    className="comment-input"
                    placeholder="Your Email"
                    value={newComment.email}
                    onChange={(e) => setNewComment(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <textarea
                  className="comment-textarea"
                  placeholder="Share your thoughts about this event..."
                  value={newComment.comment}
                  onChange={(e) => setNewComment(prev => ({ ...prev, comment: e.target.value }))}
                  required
                />
                <button type="submit" className="btn-submit-comment">Post Comment</button>
              </form>
            </div>
          </div>

        </section>

        {/* Right Sidebar */}
        <aside className="event-sidebar-right">
          <div className="sticky-sidebar">

            {/* Booking Card */}
            <div className="booking-widget-card">
              <div className="widget-price-row">
                <span className="price-label">Ticket Price</span>
                <div className="price-value-container">
                  {ticketPrice && ticketPrice > 0 ? (
                    <>
                      <span className="price-currency">₹</span>
                      <span className="price-amount">{ticketPrice}</span>
                    </>
                  ) : (
                    <span className="price-amount" style={{ color: '#34d399' }}>Free</span>
                  )}
                </div>
              </div>

              {/* Seat filling indicators */}
              <div className="widget-seats-container">
                <div className="seats-label-row">
                  <span>Available Space</span>
                  <span className="seats-filled">{availableSeats} Seats left</span>
                </div>
                <div className="seats-progress-bar">
                  <div className="seats-progress-fill" style={{ width: `${100 - percentFilled}%` }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '0.4rem' }}>
                  <span>{registrationCount || 0} Registered</span>
                  <span>{totalSeats} Total capacity</span>
                </div>
              </div>

              {/* Event details items */}
              <div className="widget-info-list">

                {/* Date & Time */}
                <div className="info-list-item">
                  <div className="info-item-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div className="info-item-details">
                    <span className="info-item-label">Start Time</span>
                    <span className="info-item-value">{formattedStart}</span>
                    <span className="info-item-label" style={{ marginTop: '0.5rem' }}>End Time</span>
                    <span className="info-item-value">{formattedEnd}</span>
                  </div>
                </div>

                {/* Registration Deadline */}
                {registrationDeadline && (
                  <div className="info-list-item">
                    <div className="info-item-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div className="info-item-details">
                      <span className="info-item-label">Registration Deadline</span>
                      <span className="info-item-value" style={{ color: '#f87171' }}>{formattedDeadline}</span>
                    </div>
                  </div>
                )}

                {/* Location */}
                <div className="info-list-item">
                  <div className="info-item-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className="info-item-details">
                    <span className="info-item-label">Venue</span>
                    <span className="info-item-value">{venueName || "Jacobi Inc"}</span>
                    <span className="info-item-subvalue">{address}</span>
                    <span className="info-item-subvalue">{city}, {state}, {pincode}</span>
                    {googleMapsLink && (
                      <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" style={{ color: '#818cf8', fontSize: '0.8rem', fontWeight: '600', marginTop: '0.25rem', textDecoration: 'underline' }}>
                        View on Google Maps
                      </a>
                    )}
                  </div>
                </div>

                {/* Contact and Links */}
                {(contactEmail || contactPhone || website) && (
                  <div className="info-list-item">
                    <div className="info-item-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div className="info-item-details">
                      <span className="info-item-label">Contact info</span>
                      {contactPhone && <span className="info-item-subvalue">Phone: {contactPhone}</span>}
                      {contactEmail && <a href={`mailto:${contactEmail}`} className="info-item-subvalue" style={{ textDecoration: 'underline' }}>{contactEmail}</a>}
                      {website && (
                        <a href={website} target="_blank" rel="noopener noreferrer" className="info-item-subvalue" style={{ color: '#818cf8', fontWeight: '600', textDecoration: 'underline' }}>
                          Visit Official Website
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Main Actions */}
              <button className="btn-primary-action" onClick={() => alert("Redirecting to event seat booking...")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                </svg>
                Book Ticket
              </button>

              <button className={`btn-secondary-action ${isLiked ? 'liked' : ''}`} onClick={handleLikeToggle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" style={{ color: isLiked ? '#ef4444' : 'inherit' }}>
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                <span>{isLiked ? 'Added to Favorites' : 'Add to Favorites'} ({likesCount})</span>
              </button>

              {/* Meeting Link Credentials if Hybrid or Online */}
              {(eventMode === "hybrid" || eventMode === "online") && (meetingLink || meetingPassword) && (
                <div className="online-credentials-box">
                  <div className="online-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="23 7 16 12 23 17 23 7" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                    Online Access details
                  </div>
                  {meetingLink && (
                    <div className="credential-field">
                      <span className="credential-label">Meeting URL:</span>
                      <a href={meetingLink} target="_blank" rel="noopener noreferrer" className="credential-value" style={{ color: '#818cf8', textDecoration: 'underline' }}>
                        {meetingLink}
                      </a>
                    </div>
                  )}
                  {meetingPassword && (
                    <div className="credential-field">
                      <span className="credential-label">Access Password:</span>
                      <span className="credential-value">{meetingPassword}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Social Share widget */}
            {socialLinks && (
              <div className="social-share-widget">
                <div className="share-widget-title">Share Event</div>
                <div className="share-buttons-grid">
                  {socialLinks.facebook && (
                    <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="btn-share-circle" aria-label="Facebook">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </a>
                  )}
                  {socialLinks.twitter && (
                    <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="btn-share-circle" aria-label="Twitter">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      </svg>
                    </a>
                  )}
                  {socialLinks.linkedin && (
                    <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="btn-share-circle" aria-label="LinkedIn">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="btn-share-circle" aria-label="Instagram">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </a>
                  )}
                  {socialLinks.youtube && (
                    <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="btn-share-circle" aria-label="YouTube">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.54a29 29 0 0 0 .46 5.12 2.78 2.78 0 0 0 1.95 1.96c1.71.46 8.59.46 8.59.46s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.12 29 29 0 0 0-.46-5.12z" />
                        <polygon points="9.75 15.02 15.5 11.54 9.75 8.06 9.75 15.02" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>

      </main>

      <Footer />

      {/* Developer Auth state switcher */}
      <div className="dev-auth-switcher">
        <span className={`dev-auth-dot ${isLoggedIn ? 'active' : 'inactive'}`}></span>
        <span>Mock User: <strong>{isLoggedIn ? 'LOGGED IN' : 'GUEST'}</strong></span>
        <button className="dev-auth-btn" onClick={() => setIsLoggedIn(!isLoggedIn)}>
          Toggle Auth State
        </button>
      </div>
    </div >
  );
}
