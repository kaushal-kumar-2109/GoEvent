import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ToastSuccess, ToastError } from '../../../utils/toast_notification';
import { GET_ORGANIZER_EVENT_DETAILS, UPDATE_EVENT, UPLOAD_IMAGE } from '../../../apis/sender';
import './manage_event_page.css';

export default function ManageEventPage({ getTheam, isUserLoggedIN, getUserData }) {
  const { eid } = useParams();
  const navigate = useNavigate();
  const userData = getUserData || JSON.parse(localStorage.getItem('GoEventUserData') || '{}');

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dbStatus, setDbStatus] = useState('DRAFT');

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

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: 'Concert & Music',
    eventType: 'PUBLIC',
    bannerImage: '',
    thumbnailImage: '',
    galleryImages: [],
    promotionalVideo: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    venueName: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    googleMapsLink: '',
    ticketPrice: 0,
    totalSeats: 0,
    availableSeats: 0,
    paymentUPI: '',
    paymentUPIName: '',
    paymentQr: '',
    organizerName: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    socialLinks: {
      instagram: '',
      facebook: '',
      linkedin: '',
      twitter: '',
      youtube: ''
    },
    speakers: [],
    faqs: [],
    schedule: [],
    refundPolicy: '',
    termsAndConditions: '',
    status: 'DRAFT'
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!isUserLoggedIN) {
      ToastError('Please log in to manage your events.');
      navigate('/login');
    }
  }, [isUserLoggedIN, navigate]);

  // Fetch Event Details
  useEffect(() => {
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
          
          const formatDateForInput = (dateStr) => {
            if (!dateStr) return '';
            const d = new Date(dateStr);
            const pad = (num) => String(num).padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
          };

          setFormData({
            title: ev.title || '',
            shortDescription: ev.shortDescription || '',
            description: ev.description || '',
            category: ev.category || 'Concert & Music',
            eventType: ev.eventType || 'PUBLIC',
            bannerImage: ev.bannerImage || '',
            thumbnailImage: ev.thumbnailImage || '',
            galleryImages: ev.galleryImages || [],
            promotionalVideo: ev.promotionalVideo || '',
            startDate: formatDateForInput(ev.startDate),
            endDate: formatDateForInput(ev.endDate),
            registrationDeadline: formatDateForInput(ev.registrationDeadline),
            venueName: ev.venueName || '',
            address: ev.address || '',
            city: ev.city || '',
            state: ev.state || '',
            country: ev.country || 'India',
            pincode: ev.pincode || '',
            googleMapsLink: ev.googleMapsLink || '',
            ticketPrice: ev.ticketPrice || 0,
            totalSeats: ev.totalSeats || 0,
            availableSeats: ev.availableSeats || 0,
            paymentUPI: ev.paymentUPI || '',
            paymentUPIName: ev.paymentUPIName || '',
            paymentQr: ev.paymentQr || '',
            organizerName: ev.organizerName || '',
            contactEmail: ev.contactEmail || '',
            contactPhone: ev.contactPhone || '',
            website: ev.website || '',
            socialLinks: {
              instagram: ev.socialLinks?.instagram || '',
              facebook: ev.socialLinks?.facebook || '',
              linkedin: ev.socialLinks?.linkedin || '',
              twitter: ev.socialLinks?.twitter || '',
              youtube: ev.socialLinks?.youtube || ''
            },
            speakers: ev.speakers || [],
            faqs: ev.faqs || [],
            schedule: ev.schedule || [],
            refundPolicy: ev.refundPolicy || '',
            termsAndConditions: ev.termsAndConditions || '',
            status: ev.status || 'DRAFT'
          });
          setDbStatus(ev.status || 'DRAFT');
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

    loadEvent();
  }, [eid, navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  // Status check locks
  const isFieldDisabled = (section, field) => {
    if (dbStatus === 'DRAFT') {
      return false; // draft: everything is editable
    }
    if (dbStatus === 'PUBLISHED') {
      if (field === 'ticketPrice') {
        return true; // published: ticketPrice is locked
      }
      return false; // rest can change
    }
    if (dbStatus === 'PENDING') {
      // pending: ONLY location (venueName, address, city, state, country, pincode, googleMapsLink), startDate, endDate, registrationDeadline can change
      const allowed = [
        'venueName', 'address', 'city', 'state', 'country', 'pincode', 'googleMapsLink',
        'startDate', 'endDate', 'registrationDeadline'
      ];
      return !allowed.includes(field);
    }
    // started, completed, cancelled, deleted: nothing can be changed
    return true;
  };

  // Confirm changes from Draft to Published
  const handleStatusChange = (newStatus) => {
    if (dbStatus === 'DRAFT' && newStatus === 'PUBLISHED') {
      const confirmChange = window.confirm(
        "⚠️ WARNING: Changing Status to PUBLISHED\n\n" +
        "• Once Published, the Ticket Price cannot be changed anymore.\n" +
        "• If the event enters Pending status, only location and event dates/deadlines will be editable.\n\n" +
        "Do you want to proceed with this status change?"
      );
      if (!confirmChange) {
        return;
      }
    }
    handleInputChange('status', newStatus);
  };

  // Image upload
  const handleImageUpload = async (e, field) => {
    const isLocked = isFieldDisabled('media', field === 'qr' ? 'paymentQr' : field === 'banner' ? 'bannerImage' : 'thumbnailImage');
    if (isLocked) {
      ToastError('Editing media is locked in this status.');
      return;
    }
    const file = e.target.files[0];
    if (!file) return;

    const dataObj = new FormData();
    dataObj.append('file', file);

    if (field === 'banner') setIsUploadingBanner(true);
    else if (field === 'thumbnail') setIsUploadingThumbnail(true);
    else if (field === 'qr') setIsUploadingQr(true);

    try {
      const res = await UPLOAD_IMAGE(dataObj);
      if (res.success && res.url) {
        if (field === 'banner') {
          handleInputChange('bannerImage', res.url);
          ToastSuccess('Banner uploaded!');
        } else if (field === 'thumbnail') {
          handleInputChange('thumbnailImage', res.url);
          ToastSuccess('Thumbnail uploaded!');
        } else if (field === 'qr') {
          handleInputChange('paymentQr', res.url);
          ToastSuccess('Payment QR Code uploaded!');
        }
      } else {
        ToastError(res.message || 'Upload failed.');
      }
    } catch (err) {
      console.error(err);
      ToastError('Error uploading image.');
    } finally {
      if (field === 'banner') setIsUploadingBanner(false);
      else if (field === 'thumbnail') setIsUploadingThumbnail(false);
      else if (field === 'qr') setIsUploadingQr(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    if (isFieldDisabled('media', 'galleryImages')) {
      ToastError('Editing gallery photos is locked.');
      return;
    }
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploadingGallery(true);
    let successCount = 0;
    const uploadedUrls = [];

    for (const file of files) {
      const dataObj = new FormData();
      dataObj.append('file', file);
      try {
        const res = await UPLOAD_IMAGE(dataObj);
        if (res.success && res.url) {
          uploadedUrls.push(res.url);
          successCount++;
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (successCount > 0) {
      setFormData(prev => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...uploadedUrls]
      }));
      ToastSuccess(`Uploaded ${successCount} gallery images!`);
    } else {
      ToastError('Failed to upload gallery images.');
    }
    setIsUploadingGallery(false);
  };

  const handleRemoveGalleryImage = (indexToRemove) => {
    if (isFieldDisabled('media', 'galleryImages')) {
      ToastError('Editing gallery photos is locked.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, idx) => idx !== indexToRemove)
    }));
    ToastSuccess('Removed gallery image.');
  };

  const handleUpdateSubmit = async () => {
    if (!formData.title.trim()) return ToastError('Event Title is required!');
    if (!formData.shortDescription.trim()) return ToastError('Short Description is required!');
    if (!formData.description.trim()) return ToastError('Detailed Description is required!');
    if (!formData.category) return ToastError('Category is required!');
    if (!formData.bannerImage) return ToastError('Event Banner Image is required!');
    if (!formData.startDate) return ToastError('Start Date is required!');
    if (!formData.endDate) return ToastError('End Date is required!');
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      return ToastError('End date must be after start date!');
    }

    setIsSaving(true);
    try {
      const res = await UPDATE_EVENT(eid, formData);
      if (res.success) {
        ToastSuccess('🎉 Event updated successfully!');
        navigate('/profile');
      } else {
        ToastError(res.message || 'Failed to update event.');
      }
    } catch (err) {
      console.error(err);
      ToastError('Error saving event updates.');
    } finally {
      setIsSaving(false);
    }
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

  const isPendingStatus = dbStatus === 'PENDING';
  const isLockedStatus = dbStatus !== 'DRAFT' && dbStatus !== 'PUBLISHED' && dbStatus !== 'PENDING';

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
        <div className="navbar-actions-wrap">
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => navigate('/profile')}>
            Cancel & Exit
          </button>
          {!isLockedStatus && (
            <button type="button" className="btn btn-primary btn-sm" onClick={handleUpdateSubmit} disabled={isSaving}>
              {isSaving ? 'Save & Exit' : 'Save & Exit'}
            </button>
          )}
        </div>
      </header>

      {/* Warning Banners */}
      {isPendingStatus && (
        <div className="manage-alert-banner pending-warning">
          <strong>⚠️ Pending Status lock:</strong> Only location, event dates, and registration deadline can be edited.
        </div>
      )}
      {isLockedStatus && (
        <div className="manage-alert-banner locked-warning">
          <strong>🚫 Read-Only mode:</strong> This event is in <strong>{dbStatus}</strong> status and cannot be edited.
        </div>
      )}

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
                      disabled={isFieldDisabled('basic', 'title')}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={e => handleInputChange('category', e.target.value)}
                      disabled={isFieldDisabled('basic', 'category')}
                    >
                      <option value="Concert & Music">Concert & Music</option>
                      <option value="Comedy & Entertainment">Comedy & Entertainment</option>
                      <option value="Tech & Innovation">Tech & Innovation</option>
                      <option value="Food & Drinks">Food & Drinks</option>
                      <option value="Workshop & Education">Workshop & Education</option>
                      <option value="Sports & Fitness">Sports & Fitness</option>
                    </select>
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
                    disabled={isFieldDisabled('basic', 'shortDescription')}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Detailed Description</label>
                  <textarea
                    className="form-textarea rich-editor-textarea"
                    value={formData.description}
                    onChange={e => handleInputChange('description', e.target.value)}
                    disabled={isFieldDisabled('basic', 'description')}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Event Access Type</label>
                  <div className="event-type-grid">
                    <div
                      className={`event-type-card ${formData.eventType === 'PUBLIC' ? 'selected' : ''} ${isFieldDisabled('basic', 'eventType') ? 'disabled-card' : ''}`}
                      onClick={() => !isFieldDisabled('basic', 'eventType') && handleInputChange('eventType', 'PUBLIC')}
                    >
                      <div className="event-type-icon">🌐</div>
                      <div className="event-type-meta">
                        <h4>Public Event</h4>
                        <p>Open for all bookings</p>
                      </div>
                    </div>

                    <div
                      className={`event-type-card ${formData.eventType === 'PRIVATE' ? 'selected' : ''} ${isFieldDisabled('basic', 'eventType') ? 'disabled-card' : ''}`}
                      onClick={() => !isFieldDisabled('basic', 'eventType') && handleInputChange('eventType', 'PRIVATE')}
                    >
                      <div className="event-type-icon">🔒</div>
                      <div className="event-type-meta">
                        <h4>Private Event</h4>
                        <p>Invite-only attendance</p>
                      </div>
                    </div>

                    <div
                      className={`event-type-card ${formData.eventType === 'ALL' ? 'selected' : ''} ${isFieldDisabled('basic', 'eventType') ? 'disabled-card' : ''}`}
                      onClick={() => !isFieldDisabled('basic', 'eventType') && handleInputChange('eventType', 'ALL')}
                    >
                      <div className="event-type-icon">👥</div>
                      <div className="event-type-meta">
                        <h4>All / Both</h4>
                      </div>
                    </div>
                  </div>
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
                      disabled={isFieldDisabled('organizer', 'organizerName')}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Email</label>
                    <input
                      type="email"
                      className="form-input"
                      value={formData.contactEmail}
                      onChange={e => handleInputChange('contactEmail', e.target.value)}
                      disabled={isFieldDisabled('organizer', 'contactEmail')}
                    />
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
                    disabled={isFieldDisabled('schedule', 'startDate')}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">End Date & Time</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={formData.endDate}
                    onChange={e => handleInputChange('endDate', e.target.value)}
                    disabled={isFieldDisabled('schedule', 'endDate')}
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
                  disabled={isFieldDisabled('schedule', 'registrationDeadline')}
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
                    disabled={isFieldDisabled('location', 'venueName')}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.city}
                    onChange={e => handleInputChange('city', e.target.value)}
                    disabled={isFieldDisabled('location', 'city')}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.state}
                    onChange={e => handleInputChange('state', e.target.value)}
                    disabled={isFieldDisabled('location', 'state')}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.pincode}
                    onChange={e => handleInputChange('pincode', e.target.value)}
                    disabled={isFieldDisabled('location', 'pincode')}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Full Address</label>
                <textarea
                  className="form-textarea"
                  value={formData.address}
                  onChange={e => handleInputChange('address', e.target.value)}
                  disabled={isFieldDisabled('location', 'address')}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Google Maps Link</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.googleMapsLink}
                  onChange={e => handleInputChange('googleMapsLink', e.target.value)}
                  disabled={isFieldDisabled('location', 'googleMapsLink')}
                />
              </div>
            </div>
          )}

          {/* STEP 4: Tickets & Pricing */}
          {currentStep === 4 && (
            <div className="form-section-card">
              <div className="section-card-header">
                <h3 className="section-card-title">Tickets & Seat Allocation</h3>
                {dbStatus === 'PUBLISHED' && (
                  <p className="status-warning-inline">Ticket price is locked after the event is published.</p>
                )}
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Ticket Price (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.ticketPrice}
                    onChange={e => handleInputChange('ticketPrice', Number(e.target.value))}
                    disabled={isFieldDisabled('tickets', 'ticketPrice')}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Total Seats Capacity</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.totalSeats}
                    onChange={e => handleInputChange('totalSeats', Number(e.target.value))}
                    disabled={isFieldDisabled('tickets', 'totalSeats')}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Available Seats</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.availableSeats}
                    onChange={e => handleInputChange('availableSeats', Number(e.target.value))}
                    disabled={isFieldDisabled('tickets', 'availableSeats')}
                  />
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
                    disabled={isFieldDisabled('tickets', 'paymentUPI')}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">UPI Payee Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.paymentUPIName}
                    onChange={e => handleInputChange('paymentUPIName', e.target.value)}
                    disabled={isFieldDisabled('tickets', 'paymentUPIName')}
                  />
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
                  disabled={isFieldDisabled('tickets', 'paymentQr')}
                />
                {formData.paymentQr && !isUploadingQr ? (
                  <div className="uploaded-qr-container">
                    <img src={formData.paymentQr} alt="Payment QR" className="qr-preview-thumb" />
                    {!isFieldDisabled('tickets', 'paymentQr') && (
                      <button type="button" className="btn btn-secondary btn-xs mt-1" onClick={() => qrInputRef.current.click()}>
                        Change QR Code
                      </button>
                    )}
                  </div>
                ) : (
                  <div 
                    className={`upload-dropzone qr-upload ${isFieldDisabled('tickets', 'paymentQr') ? 'disabled-drop' : ''}`} 
                    onClick={() => !isFieldDisabled('tickets', 'paymentQr') && qrInputRef.current.click()}
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
                  disabled={isFieldDisabled('additional', 'promotionalVideo')}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Refund Policy</label>
                <textarea
                  className="form-textarea"
                  value={formData.refundPolicy}
                  onChange={e => handleInputChange('refundPolicy', e.target.value)}
                  disabled={isFieldDisabled('additional', 'refundPolicy')}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Terms & Conditions</label>
                <textarea
                  className="form-textarea"
                  value={formData.termsAndConditions}
                  onChange={e => handleInputChange('termsAndConditions', e.target.value)}
                  disabled={isFieldDisabled('additional', 'termsAndConditions')}
                ></textarea>
              </div>
            </div>
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
                <p><strong>Database Status:</strong> <span className={`preview-status-badge status-${dbStatus.toLowerCase()}`}>{dbStatus}</span></p>
              </div>

              {!isLockedStatus && (
                <div className="form-group mt-3">
                  <label className="form-label font-bold">Change Event Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={e => handleStatusChange(e.target.value)}
                    disabled={dbStatus !== 'DRAFT'}
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                  {dbStatus === 'DRAFT' && (
                    <p className="form-help-text mt-1 text-muted">
                      Moving status to <strong>Published</strong> enables the payment checks and locks edit details fields.
                    </p>
                  )}
                </div>
              )}
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
              ) : (
                !isLockedStatus && (
                  <button type="button" className="btn btn-primary" onClick={handleUpdateSubmit} disabled={isSaving}>
                    {isSaving ? 'Saving Changes...' : 'Save & Exit'}
                  </button>
                )
              )}
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
              disabled={isFieldDisabled('media', 'bannerImage')}
            />
            {formData.bannerImage && !isUploadingBanner ? (
              <div className="uploaded-image-container">
                <img src={formData.bannerImage} alt="Banner" className="image-preview-thumb" />
                {!isFieldDisabled('media', 'bannerImage') && (
                  <button type="button" className="btn btn-secondary btn-xs change-image-btn" onClick={() => bannerInputRef.current.click()}>
                    Change Banner
                  </button>
                )}
              </div>
            ) : (
              <div 
                className={`upload-dropzone ${isFieldDisabled('media', 'bannerImage') ? 'disabled-drop' : ''}`} 
                onClick={() => !isFieldDisabled('media', 'bannerImage') && bannerInputRef.current.click()}
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
              disabled={isFieldDisabled('media', 'thumbnailImage')}
            />
            {formData.thumbnailImage && !isUploadingThumbnail ? (
              <div className="uploaded-image-container">
                <img src={formData.thumbnailImage} alt="Thumbnail" className="image-preview-thumb" />
                {!isFieldDisabled('media', 'thumbnailImage') && (
                  <button type="button" className="btn btn-secondary btn-xs change-image-btn" onClick={() => thumbnailInputRef.current.click()}>
                    Change Thumbnail
                  </button>
                )}
              </div>
            ) : (
              <div 
                className={`upload-dropzone ${isFieldDisabled('media', 'thumbnailImage') ? 'disabled-drop' : ''}`} 
                onClick={() => !isFieldDisabled('media', 'thumbnailImage') && thumbnailInputRef.current.click()}
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
              onChange={handleGalleryUpload}
              disabled={isFieldDisabled('media', 'galleryImages')}
            />
            <div className="gallery-section">
              <div className="gallery-grid">
                {formData.galleryImages.map((img, idx) => (
                  <div key={idx} className="gallery-item-wrap">
                    <img src={img} alt={`Gallery ${idx}`} className="gallery-img-thumb" />
                    {!isFieldDisabled('media', 'galleryImages') && (
                      <button type="button" className="gallery-remove-btn" onClick={() => handleRemoveGalleryImage(idx)}>
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {!isFieldDisabled('media', 'galleryImages') && (
                  !isUploadingGallery ? (
                    <div className="gallery-add-card" onClick={() => galleryInputRef.current.click()}>
                      <span className="plus-sign">+</span>
                    </div>
                  ) : (
                    <div className="gallery-add-card loading-card">
                      <div className="spinner sm"></div>
                    </div>
                  )
                )}
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
