import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ToastSuccess, ToastError } from '../../../utils/toast_notification';
import { GET_ORGANIZER_EVENT_DETAILS, UPDATE_EVENT, UPLOAD_IMAGE } from '../../../apis/sender';
import './manage_event_page.css';

export default function ManageEventPage({ getTheam }) {
  const { eid } = useParams();
  const navigate = useNavigate();
  const [getNote, setNote] = useState("");

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // File upload input refs
  const bannerInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const qrInputRef = useRef(null);

  // Upload loading states
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [isUploadingQr, setIsUploadingQr] = useState(false);

  const [newSchedule, setNewSchedule] = useState({ time: '', event: '', description: '' });
  const [editingScheduleIndex, setEditingScheduleIndex] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '', shortDescription: '', description: '', category: 'Concert & Music', eventType: 'PUBLIC', bannerImage: '', thumbnailImage: '',
    galleryImages: [], promotionalVideo: '', startDate: '', endDate: '', registrationDeadline: '', venueName: '',
    address: '', city: '', state: '', country: 'India', pincode: '', googleMapsLink: '', ticketPrice: 0, totalSeats: 0, availableSeats: 0,
    paymentUPI: '', paymentUPIName: '', paymentQr: '', organizerName: '', contactEmail: '', contactPhone: '', website: '',
    socialLinks: { instagram: '', facebook: '', linkedin: '', twitter: '', youtube: '' },
    speakers: [], faqs: [], schedule: [], refundPolicy: '', termsAndConditions: '', status: 'DRAFT'
  });

  const loadEvent = async () => {
    if (!eid) {
      ToastError('Invalid Event Reference.');
      navigate('/profile');
      return;
    }
    setIsLoading(true);
    try {
      const res = await GET_ORGANIZER_EVENT_DETAILS(eid);
      if (res.success && res.event) {
        const ev = res.event;
        setNote(res.note);
        const formatDateForInput = (dateStr) => {
          if (!dateStr) return '';
          const d = new Date(dateStr);
          const pad = (num) => String(num).padStart(2, '0');
          return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        };
        setFormData({
          title: ev.title || 'NA',
          shortDescription: ev.shortDescription || 'NA',
          description: ev.description || 'NA',
          category: ev.category || 'NA',
          eventType: ev.eventType || 'NA',
          bannerImage: ev.bannerImage || 'NA',
          thumbnailImage: ev.thumbnailImage || 'NA',
          galleryImages: ev.galleryImages || 'NA',
          promotionalVideo: ev.promotionalVideo || 'NA',
          startDate: formatDateForInput(ev.startDate),
          endDate: formatDateForInput(ev.endDate),
          registrationDeadline: formatDateForInput(ev.registrationDeadline),
          venueName: ev.venueName || 'NA',
          address: ev.address || 'NA',
          city: ev.city || 'NA',
          state: ev.state || 'NA',
          country: ev.country || 'NA',
          pincode: ev.pincode || 'NA',
          googleMapsLink: ev.googleMapsLink || 'NA',
          ticketPrice: ev.ticketPrice || 0,
          totalSeats: ev.totalSeats || 0,
          availableSeats: ev.availableSeats || 0,
          paymentUPI: ev.paymentUPI || 'NA',
          paymentUPIName: ev.paymentUPIName || 'NA',
          paymentQr: ev.paymentQr || 'NA',
          organizerName: ev.organizerName || 'NA',
          contactEmail: ev.contactEmail || 'NA',
          contactPhone: ev.contactPhone || 'NA',
          website: ev.website || 'NA',
          socialLinks: {
            instagram: ev.socialLinks?.instagram || 'NA',
            facebook: ev.socialLinks?.facebook || 'NA',
            linkedin: ev.socialLinks?.linkedin || 'NA',
            twitter: ev.socialLinks?.twitter || 'NA',
            youtube: ev.socialLinks?.youtube || 'NA'
          },
          speakers: ev.speakers || [],
          faqs: ev.faqs || [],
          schedule: ev.schedule || [],
          refundPolicy: ev.refundPolicy || 'NA',
          termsAndConditions: ev.termsAndConditions || 'NA',
          status: ev.status || 'NA'
        });
      } else {
        ToastError(res.message || 'Failed to retrieve event.');
        navigate('/profile');
      }
    } catch (err) {
      console.error(err);
      ToastError('Error communicating with the database.');
      navigate('/profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if not logged in
  useEffect(() => {
    const raw = localStorage.getItem("GoEventUserData");
    if (!raw) {
      ToastError('Please log in to manage your events.');
      navigate('/login');
    }
  }, [navigate]);

  // Fetch Event Details
  useEffect(() => {
    loadEvent();
  }, [eid, navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };


  const handleNextStep = () => {
    if (currentStep < 6) setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const steps = [
    { id: 1, label: 'Basic Details' },
    { id: 2, label: 'Date & Time' },
    { id: 3, label: 'Location & Venue' },
    { id: 4, label: 'Tickets & Pricing' },
    { id: 5, label: 'Additional Details' },
    { id: 6, label: 'Review & Save' }
  ];

  if (isLoading) {
    return (
      <div className="manage-page-loader">
        <div className="spinner"></div>
        <p>Loading Event Data...</p>
      </div>
    );
  }


  return (
    <div className={`manage-page-wrapper theme-${getTheam}`}>
      {/* Top Navbar */}
      <header className="manage-header-navbar">
        <div className="navbar-logo-wrap">
          <Link to="/GoEvent" className="navbar-brand">
            <svg viewBox="0 0 24 24" width="28" height="28" className="brand-logo-icon">
              <path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="brand-logo-text">GoEvent</span>
          </Link>
          <span className="navbar-separator">/</span>
          <span className="navbar-page-title">Manage Event</span>
        </div>
        {(formData.status != "STARTED" || formData.status != "COMPLETED" || formData.status != "CENCELLED" || formData.status != "DELETED") &&
          <div className="navbar-actions-wrap">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => navigate('/profile')}>
              Cancel & Exit
            </button>
            <button type="button" className="btn btn-primary btn-sm">
              Save & Exit
            </button>
          </div>
        }
      </header>

      <div className="manage-alert-banner pending-warning">
        <strong>⚠️ {formData.status} Status lock:</strong> {getNote}
      </div>

      {/* Stepper Progress Section */}
      <div className="manage-stepper-container">
        <div className="manage-stepper-row">
          {steps.map((step, idx) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  className={`stepper-button-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                  onClick={() => setCurrentStep(step.id)}
                >
                  <div className="stepper-circle-number">{step.id}</div>
                  <span className="stepper-label-text">{step.label}</span>
                </button>
                {idx < steps.length - 1 && (
                  <div className={`stepper-connector-line ${currentStep > step.id ? 'active' : ''}`}></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Layout Grid */}
      <main className="manage-layout-grid-content">
        {/* Form Column */}
        <div className="manage-main-form-column">
          {/* STEP 1: Basic Details */}
          {currentStep === 1 && (
            <>
              <div className="form-section-card">
                <div className="section-card-header">
                  <h3 className="section-card-title">Basic Details</h3>
                  <p className="section-card-subtitle">Edit basic event details, title, and access type.</p>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      Event Title
                      <span className="char-counter">{formData.title.length}/100</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      maxLength={100}
                      value={formData.title}
                      onChange={e => handleInputChange('title', e.target.value)}
                      disabled={(formData.status != "DRAFT" && formData.status != "PUBLISHED")}
                      title={(formData.status != "DRAFT" && formData.status != "PUBLISHED") ? "You can't update title 'Update Time Over'." : 'Enter your event title'}
                    />
                    {(formData.status != "DRAFT" && formData.status != "PUBLISHED") && <span className='bloked-field'>blocked 🚫</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={e => handleInputChange('category', e.target.value)}
                      disabled={(formData.status != "DRAFT")}
                      title={(formData.status != "DRAFT") ? "You can't update category 'Update Time Over'." : 'Select your event category'}
                    >
                      <option value="Concert & Music">Concert & Music</option>
                      <option value="Comedy & Entertainment">Comedy & Entertainment</option>
                      <option value="Tech & Innovation">Tech & Innovation</option>
                      <option value="Food & Drinks">Food & Drinks</option>
                      <option value="Workshop & Education">Workshop & Education</option>
                      <option value="Sports & Fitness">Sports & Fitness</option>
                    </select>
                    {(formData.status != "DRAFT") && <span className='bloked-field'>blocked 🚫</span>}
                  </div>

                </div>

                <div className="form-group">
                  <label className="form-label">Short Description</label>
                  <input
                    type="text"
                    className="form-input"
                    maxLength={150}
                    value={formData.shortDescription}
                    onChange={e => handleInputChange('shortDescription', e.target.value)}
                    disabled={(formData.status != "DRAFT" && formData.status != "PUBLISHED")}
                    title={(formData.status != "DRAFT" && formData.status != "PUBLISHED") ? "You can't update short description 'Update Time Over'." : 'Enter your short description'}
                  />
                  {(formData.status != "DRAFT" && formData.status != "PUBLISHED") && <span className='bloked-field'>blocked 🚫</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Detailed Description</label>
                  <textarea
                    className="form-textarea rich-editor-textarea"
                    value={formData.description}
                    onChange={e => handleInputChange('description', e.target.value)}
                    disabled={(formData.status != "DRAFT" && formData.status != "PUBLISHED")}
                    title={(formData.status != "DRAFT" && formData.status != "PUBLISHED") ? "You can't update description 'Update Time Over'." : 'Enter your description'}
                  ></textarea>
                  {(formData.status != "DRAFT" && formData.status != "PUBLISHED") && <span className='bloked-field'>blocked 🚫</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Event Access Type</label>
                  <div className="event-type-grid">
                    <div
                      className={`event-type-card ${formData.eventType === 'PUBLIC' ? 'selected' : ''} ${(formData.status != "DRAFT") ? 'disabled-card' : ''}`}
                      onClick={() => handleInputChange('eventType', 'PUBLIC')}
                      title={(formData.status != "DRAFT") ? "You can't update event type 'Update Time Over'." : 'Enter your event type'}
                    >
                      <div className="event-type-icon">🌐</div>
                      <div className="event-type-meta">
                        <h4>Public Event</h4>
                        <p>Open for all bookings</p>
                      </div>
                    </div>

                    <div
                      className={`event-type-card ${formData.eventType === 'PRIVATE' ? 'selected' : ''} ${(formData.status != "DRAFT") ? 'disabled-card' : ''}`}
                      onClick={() => handleInputChange('eventType', 'PRIVATE')}
                      title={(formData.status != "DRAFT") ? "You can't update event type 'Update Time Over'." : 'Enter your event type'}
                    >
                      <div className="event-type-icon">🔒</div>
                      <div className="event-type-meta">
                        <h4>Private Event</h4>
                        <p>Invite-only attendance</p>
                      </div>
                    </div>

                    <div
                      className={`event-type-card ${formData.eventType === 'ALL' ? 'selected' : ''} ${(formData.status != "DRAFT") ? 'disabled-card' : ''}`}
                      onClick={() => handleInputChange('eventType', 'ALL')}
                      title={(formData.status != "DRAFT") ? "You can't update event type 'Update Time Over'." : 'Enter your event type'}
                    >
                      <div className="event-type-icon">👥</div>
                      <div className="event-type-meta">
                        <h4>All / Both</h4>
                      </div>
                    </div>
                  </div>
                  {(formData.status != "DRAFT") && <span className='bloked-field'>blocked 🚫</span>}
                </div>
              </div>

              {/* Organizer Detail Card */}
              <div className="form-section-card">
                <div className="section-card-header">
                  <h3 className="section-card-title">Organizer details</h3>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Organizer Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.organizerName}
                      onChange={e => handleInputChange('organizerName', e.target.value)}
                      disabled={(formData.status != "DRAFT" && formData.status != "PUBLISHED")}
                      title={(formData.status != "DRAFT" && formData.status != "PUBLISHED") ? "You can't update organizer name 'Update Time Over'." : 'Enter your organizer name'}
                    />
                    {(formData.status != "DRAFT" && formData.status != "PUBLISHED") && <span className='bloked-field'>blocked 🚫</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Email</label>
                    <input
                      type="email"
                      className="form-input"
                      value={formData.contactEmail}
                      onChange={e => handleInputChange('contactEmail', e.target.value)}
                      disabled={(formData.status != "DRAFT" && formData.status != "PUBLISHED")}
                      title={(formData.status != "DRAFT" && formData.status != "PUBLISHED") ? "You can't update contact email 'Update Time Over'." : 'Enter your contact email'}
                    />
                    {(formData.status != "DRAFT" && formData.status != "PUBLISHED") && <span className='bloked-field'>blocked 🚫</span>}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* STEP 2: Date & Time */}
          {currentStep === 2 && (
            <div className="form-section-card">
              <div className="section-card-header">
                <h3 className="section-card-title">Date & Time Settings</h3>
                <p className="section-card-subtitle">These dates remain editable in DRAFT, PUBLISHED, and PENDING states.</p>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={formData.startDate}
                    onChange={e => handleInputChange('startDate', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">End Date & Time</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={formData.endDate}
                    onChange={e => handleInputChange('endDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group mt-2">
                <label className="form-label">Registration Deadline</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={formData.registrationDeadline}
                  onChange={e => handleInputChange('registrationDeadline', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 3: Location & Venue */}
          {currentStep === 3 && (
            <div className="form-section-card">
              <div className="section-card-header">
                <h3 className="section-card-title">Location & Venue Details</h3>
                <p className="section-card-subtitle">These details remain editable in DRAFT, PUBLISHED, and PENDING states.</p>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Venue Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.venueName}
                    onChange={e => handleInputChange('venueName', e.target.value)}
                    disabled={(formData.status != "DRAFT" && formData.status != "PUBLISHED")}
                    title={(formData.status != "DRAFT" && formData.status != "PUBLISHED") ? "You can't update venue name 'Update Time Over'." : 'Enter your venue name'}
                  />
                  {(formData.status != "DRAFT" && formData.status != "PUBLISHED") && <span className='bloked-field'>blocked 🚫</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.city}
                    onChange={e => handleInputChange('city', e.target.value)}
                    disabled={(formData.status != "DRAFT" && formData.status != "PUBLISHED")}
                    title={(formData.status != "DRAFT" && formData.status != "PUBLISHED") ? "You can't update city 'Update Time Over'." : 'Enter your city'}
                  />
                  {(formData.status != "DRAFT" && formData.status != "PUBLISHED") && <span className='bloked-field'>blocked 🚫</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.state}
                    onChange={e => handleInputChange('state', e.target.value)}
                    disabled={(formData.status != "DRAFT" && formData.status != "PUBLISHED")}
                    title={(formData.status != "DRAFT" && formData.status != "PUBLISHED") ? "You can't update state 'Update Time Over'." : 'Enter your state'}
                  />
                  {(formData.status != "DRAFT" && formData.status != "PUBLISHED") && <span className='bloked-field'>blocked 🚫</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.pincode}
                    onChange={e => handleInputChange('pincode', e.target.value)}
                    disabled={(formData.status != "DRAFT" && formData.status != "PUBLISHED")}
                    title={(formData.status != "DRAFT" && formData.status != "PUBLISHED") ? "You can't update pincode 'Update Time Over'." : 'Enter your pincode'}
                  />
                  {(formData.status != "DRAFT" && formData.status != "PUBLISHED") && <span className='bloked-field'>blocked 🚫</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Full Address</label>
                <textarea
                  className="form-textarea"
                  value={formData.address}
                  onChange={e => handleInputChange('address', e.target.value)}
                  disabled={(formData.status != "DRAFT" && formData.status != "PUBLISHED")}
                  title={(formData.status != "DRAFT" && formData.status != "PUBLISHED") ? "You can't update address 'Update Time Over'." : 'Enter your address'}
                ></textarea>
                {(formData.status != "DRAFT" && formData.status != "PUBLISHED") && <span className='bloked-field'>blocked 🚫</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Google Maps Link</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.googleMapsLink}
                  onChange={e => handleInputChange('googleMapsLink', e.target.value)}
                  disabled={(formData.status != "DRAFT" && formData.status != "PUBLISHED")}
                  title={(formData.status != "DRAFT" && formData.status != "PUBLISHED") ? "You can't update google maps link 'Update Time Over'." : 'Enter your google maps link'}
                />
                {(formData.status != "DRAFT" && formData.status != "PUBLISHED") && <span className='bloked-field'>blocked 🚫</span>}
              </div>
            </div>
          )}

          {/* STEP 4: Tickets & Pricing */}
          {currentStep === 4 && (
            <div className="form-section-card">
              <div className="section-card-header">
                <h3 className="section-card-title">Tickets & Seat Allocation</h3>
                {(formData.status != "DRAFT") && <span className='bloked-field'>Section Blocked 🚫</span>}
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Ticket Price (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.ticketPrice}
                    onChange={e => handleInputChange('ticketPrice', Number(e.target.value))}
                    disabled={(formData.status != "DRAFT")}
                    title={(formData.status != "DRAFT") ? "You can't update ticket price 'Update Time Over'." : 'Enter your ticket price'}
                  />
                  {(formData.status != "DRAFT") && <span className='bloked-field'>blocked 🚫</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Total Seats Capacity</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.totalSeats}
                    onChange={e => handleInputChange('totalSeats', Number(e.target.value))}
                    disabled={(formData.status != "DRAFT")}
                    title={(formData.status != "DRAFT") ? "You can't update total seats 'Update Time Over'." : 'Enter your total seats'}
                  />
                  {(formData.status != "DRAFT") && <span className='bloked-field'>blocked 🚫</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Available Seats</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.availableSeats}
                    onChange={e => handleInputChange('availableSeats', Number(e.target.value))}
                    disabled={(formData.status != "DRAFT")}
                    title={(formData.status != "DRAFT") ? "You can't update available seats 'Update Time Over'." : 'Enter your available seats'}
                  />
                  {(formData.status != "DRAFT") && <span className='bloked-field'>blocked 🚫</span>}
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Payment UPI ID</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.paymentUPI}
                    onChange={e => handleInputChange('paymentUPI', e.target.value)}
                    disabled={(formData.status != "DRAFT")}
                    title={(formData.status != "DRAFT") ? "You can't update payment UPI ID 'Update Time Over'." : 'Enter your payment UPI ID'}
                  />
                  {(formData.status != "DRAFT") && <span className='bloked-field'>blocked 🚫</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">UPI Payee Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.paymentUPIName}
                    onChange={e => handleInputChange('paymentUPIName', e.target.value)}
                    disabled={(formData.status != "DRAFT")}
                    title={(formData.status != "DRAFT") ? "You can't update UPI Payee Name 'Update Time Over'." : 'Enter your UPI Payee Name'}
                  />
                  {(formData.status != "DRAFT") && <span className='bloked-field'>blocked 🚫</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Payment QR Code (Optional)</label>
                <input
                  type="file"
                  ref={qrInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'qr')}
                  disabled={(formData.status != "DRAFT")}
                  title={(formData.status != "DRAFT") ? "You can't update payment QR code 'Update Time Over'." : 'Upload your payment QR code'}
                />
                {(formData.status != "DRAFT") && <span className='bloked-field'>blocked 🚫</span>}
                {formData.paymentQr && !isUploadingQr ? (
                  <div className="uploaded-qr-container">
                    <img src={formData.paymentQr} alt="Payment QR" className="qr-preview-thumb" />

                    <button type="button" className="btn btn-secondary btn-xs mt-1" onClick={() => qrInputRef.current.click()}>
                      Change QR Code
                    </button>
                  </div>
                ) : (
                  <div
                    className={`upload-dropzone qr-upload ${'disabled-drop'}`}
                    onClick={() => qrInputRef.current.click()}
                  >
                    <div className="upload-icon-circle">
                      {isUploadingQr ? <div className="spinner"></div> : '📱'}
                    </div>
                    <span className="upload-hint-title">{isUploadingQr ? 'Uploading QR...' : 'Upload Payment QR Code'}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: Additional Details */}
          {currentStep === 5 && (
            <>
              <div className="form-section-card">
                <div className="section-card-header">
                  <h3 className="section-card-title">Additional Policies & Info</h3>
                </div>

                <div className="form-group">
                  <label className="form-label">Promotional Video URL</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.promotionalVideo}
                    onChange={e => handleInputChange('promotionalVideo', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Refund Policy</label>
                  <textarea
                    className="form-textarea"
                    value={formData.refundPolicy}
                    onChange={e => handleInputChange('refundPolicy', e.target.value)}
                    disabled={(formData.status != "DRAFT")}
                    title={(formData.status != "DRAFT") ? "You can't update refund policy 'Update Time Over'." : 'Enter your refund policy'}
                  ></textarea>
                  {(formData.status != "DRAFT") && <span className='bloked-field'>blocked 🚫</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Terms & Conditions</label>
                  <textarea
                    className="form-textarea"
                    value={formData.termsAndConditions}
                    onChange={e => handleInputChange('termsAndConditions', e.target.value)}
                    disabled={(formData.status != "DRAFT")}
                    title={(formData.status != "DRAFT") ? "You can't update terms and conditions 'Update Time Over'." : 'Enter your terms and conditions'}
                  ></textarea>
                  {(formData.status != "DRAFT") && <span className='bloked-field'>blocked 🚫</span>}
                </div>
              </div>

              {/* Event Schedule Timeline Builder Card */}
              <div className="form-section-card schedule-builder-card">
                <div className="section-card-header">
                  <h3 className="section-card-title">Event Schedule & Agenda</h3>
                  <p className="section-card-subtitle">Create a timeline program for your event. Add sessions, timings, and brief details.</p>
                </div>


                <div className="schedule-form-wrapper">
                  <div className="form-grid-3">
                    <div className="form-group">
                      <label className="form-label">Session Time <span className="required-star">*</span></label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. 10:00 AM or 11:30 AM - 01:00 PM"
                        value={newSchedule.time}
                        onChange={e => setNewSchedule(prev => ({ ...prev, time: e.target.value }))}
                        disabled={(formData.status != "DRAFT" && formData.status != "PUBLISHED")}
                        title={(formData.status != "DRAFT" && formData.status != "PUBLISHED") ? "You can't update session time 'Update Time Over'." : 'Enter your session time'}
                      />
                      {(formData.status != "DRAFT" && formData.status != "PUBLISHED") && <span className='bloked-field'>blocked 🚫</span>}
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Session / Event Title <span className="required-star">*</span></label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Opening Keynote & Speaker Introduction"
                        value={newSchedule.event}
                        onChange={e => setNewSchedule(prev => ({ ...prev, event: e.target.value }))}
                        disabled={(formData.status != "DRAFT" && formData.status != "PUBLISHED")}
                        title={(formData.status != "DRAFT" && formData.status != "PUBLISHED") ? "You can't update session title 'Update Time Over'." : 'Enter your session title'}
                      />
                      {(formData.status != "DRAFT" && formData.status != "PUBLISHED") && <span className='bloked-field'>blocked 🚫</span>}
                    </div>
                  </div>

                  <div className="form-group mt-2">
                    <label className="form-label">Session Description <span className="required-star">*</span></label>
                    <textarea
                      className="form-textarea"
                      placeholder="Briefly describe what will happen during this session..."
                      rows={2}
                      value={newSchedule.description}
                      onChange={e => setNewSchedule(prev => ({ ...prev, description: e.target.value }))}
                      disabled={(formData.status != "DRAFT" && formData.status != "PUBLISHED")}
                      title={(formData.status != "DRAFT" && formData.status != "PUBLISHED") ? "You can't update session description 'Update Time Over'." : 'Enter your session description'}
                    ></textarea>
                    {(formData.status != "DRAFT" && formData.status != "PUBLISHED") && <span className='bloked-field'>blocked 🚫</span>}
                  </div>

                  {(formData.status === "DRAFT" || formData.status === "PUBLISHED") &&
                    <div className="schedule-form-actions mt-2" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      {editingScheduleIndex !== null && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setEditingScheduleIndex(null);
                            setNewSchedule({ time: '', event: '', description: '' });
                          }}
                          disabled={(formData.status != "DRAFT" && formData.status != "PUBLISHED")}
                          title={(formData.status != "DRAFT" && formData.status != "PUBLISHED") ? "You can't update session title 'Update Time Over'." : 'Enter your session title'}
                        >
                          Cancel Edit
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                      >
                        {editingScheduleIndex !== null ? '✏️ Update Session' : '＋ Add Session to Schedule'}
                      </button>
                    </div>
                  }

                </div>

                {(formData.status != "DRAFT" && formData.status != "PUBLISHED") &&
                  <div className="schedule-locked-notice" style={{ padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tag)', color: 'var(--text-muted)', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🔒</span>
                    <span className='bloked-field'>Editing event schedule is locked in this event status.</span>
                  </div>
                }


                {formData.schedule && formData.schedule.length > 0 && (
                  <div className="schedule-list-wrapper mt-3">
                    <h4 className="tips-title">Current Program Agenda ({formData.schedule.length})</h4>
                    <div className="schedule-preview-timeline">
                      {formData.schedule.map((item, idx) => (
                        <div key={idx} className={`schedule-preview-item ${editingScheduleIndex === idx ? 'editing' : ''}`}>
                          <div className="schedule-preview-time-badge">{item.time}</div>
                          <div className="schedule-preview-info">
                            <h5>{item.event}</h5>
                            <p>{item.description}</p>
                          </div>

                          {(formData.status === "DRAFT" || formData.status === "PUBLISHED") &&
                            <div className="schedule-preview-actions">
                              <button
                                type="button"
                                className="action-icon-btn edit-btn"
                                title="Edit Session"
                                onClick={() => handleEditSchedule(idx)}
                              >
                                ✏️
                              </button>
                              <button
                                type="button"
                                className="action-icon-btn delete-btn"
                                title="Delete Session"
                                onClick={() => handleRemoveSchedule(idx)}
                              >
                                🗑️
                              </button>
                            </div>
                          }

                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* STEP 6: Review & Status Adjustments */}
          {currentStep === 6 && (
            <div className="form-section-card">
              <div className="section-card-header">
                <h3 className="section-card-title">Review & Save</h3>
              </div>

              <div className="review-meta-summary">
                <p><strong>Title:</strong> {formData.title || 'Untitled Event'}</p>
                <p><strong>Category:</strong> {formData.category}</p>
                <p><strong>Price:</strong> ₹{formData.ticketPrice}</p>
                <p><strong>Database Status:</strong> <span className={`preview-status-badge status-${formData.status.toLowerCase()}`}></span></p>
              </div>

            </div>
          )}

          {/* Footer Controls */}
          <div className="manage-navigation-controls">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/profile')}>
              Cancel
            </button>

            <div className="action-step-buttons">
              {currentStep > 1 && (
                <button type="button" className="btn btn-secondary" onClick={handlePrevStep}>
                  Previous
                </button>
              )}
              {currentStep < 6 ? (
                <button type="button" className="btn btn-primary" onClick={handleNextStep}>
                  Next
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Media & Preview Column */}
        <div className="manage-sidebar-column">
          <div className="form-section-card media-upload-card">
            <h4 className="tips-title">Event Banner Image *</h4>
            <input
              type="file"
              ref={bannerInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'banner')}
              disabled={(formData.status != "DRAFT" && formData.status != "PUBLISHED")}
              title={(formData.status != "DRAFT" && formData.status != "PUBLISHED") ? "Event is locked, cannot upload image" : "Upload image"}
            />
            {formData.bannerImage && !isUploadingBanner ? (
              <div className="uploaded-image-container">
                <img src={formData.bannerImage} alt="Banner" className="image-preview-thumb" />
                {(formData.status != "DRAFT" || formData.status != "PUBLISHED") &&
                  <button type="button" className="btn btn-secondary btn-xs change-image-btn" onClick={() => bannerInputRef.current.click()}>
                    Change Banner
                  </button>
                }
              </div>
            ) : (
              <div
                className={`upload-dropzone ${'disabled-drop'}`}
                onClick={() => bannerInputRef.current.click()}
              >
                <div className="upload-icon-circle">
                  {isUploadingBanner ? <div className="spinner"></div> : '📷'}
                </div>
                <span className="upload-hint-title">{isUploadingBanner ? 'Uploading...' : 'Upload Banner'}</span>
              </div>
            )}

            <h4 className="tips-title mt-2">Thumbnail Image</h4>
            <input
              type="file"
              ref={thumbnailInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'thumbnail')}
              disabled={(formData.status != "DRAFT" && formData.status != "PUBLISHED")}
              title={(formData.status != "DRAFT" && formData.status != "PUBLISHED") ? "Event is locked, cannot upload image" : "Upload image"}
            />
            {formData.thumbnailImage && !isUploadingThumbnail ? (
              <div className="uploaded-image-container">
                <img src={formData.thumbnailImage} alt="Thumbnail" className="image-preview-thumb" />
                {(formData.status != "DRAFT" || formData.status != "PUBLISHED") &&
                  <button type="button" className="btn btn-secondary btn-xs change-image-btn" onClick={() => thumbnailInputRef.current.click()}>
                    Change Thumbnail
                  </button>
                }

              </div>
            ) : (
              <div
                className={`upload-dropzone ${'disabled-drop'}`}
                onClick={() => thumbnailInputRef.current.click()}
              >
                <div className="upload-icon-circle">
                  {isUploadingThumbnail ? <div className="spinner"></div> : '🖼️'}
                </div>
                <span className="upload-hint-title">{isUploadingThumbnail ? 'Uploading...' : 'Upload Thumbnail'}</span>
              </div>
            )}

            <h4 className="tips-title mt-2">Gallery Images</h4>
            <input
              type="file"
              ref={galleryInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              multiple
              disabled={(formData.status != "DRAFT" && formData.status != "PUBLISHED")}
              title={(formData.status != "DRAFT" && formData.status != "PUBLISHED") ? "Event is locked, cannot upload image" : "Upload image"}
            />
            <div className="gallery-section">
              <div className="gallery-grid">
                {formData.galleryImages.map((img, idx) => (
                  <div key={idx} className="gallery-item-wrap">
                    <img src={img} alt={`Gallery ${idx}`} className="gallery-img-thumb" />

                    {(formData.status != "DRAFT" && formData.status != "PUBLISHED") &&
                      <button type="button" className="gallery-remove-btn" onClick={() => handleRemoveGalleryImage(idx)}>
                        ×
                      </button>
                    }

                  </div>
                ))}
                {
                  !isUploadingGallery ? (
                    (formData.status != "DRAFT" || formData.status != "PUBLISHED") &&
                    <div className="gallery-add-card" onClick={() => galleryInputRef.current.click()}>
                      <span className="plus-sign">+</span>
                    </div>
                  ) : (
                    <div className="gallery-add-card loading-card">
                      <div className="spinner sm"></div>
                    </div>
                  )
                }
              </div>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="live-preview-card">
            <div className="preview-card-header">Publishing Preview</div>
            <div className="preview-banner-wrap">
              {formData.bannerImage ? (
                <img src={formData.bannerImage} alt="Banner Preview" className="preview-banner-img" />
              ) : (
                <div className="preview-banner-placeholder">
                  <span>Banner Image Preview</span>
                </div>
              )}
              <span className="preview-category-badge">{formData.category}</span>
            </div>
            <div className="preview-body">
              <div className="preview-status-badge-row">
                <span className={`preview-status-badge status-${formData.status.toLowerCase()}`}>
                  {formData.status}
                </span>
              </div>
              <h4 className="preview-title">{formData.title || 'Event Title Preview'}</h4>
              <p className="preview-short-desc">
                {formData.shortDescription || 'Short description of your event...'}
              </p>
              <div className="preview-meta-row">
                <span>📍 {formData.venueName || 'Venue'}, {formData.city}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
