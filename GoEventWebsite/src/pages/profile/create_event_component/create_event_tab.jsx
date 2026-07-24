import React, { useState, useRef } from 'react';
import { ToastSuccess, ToastError } from '../../../utils/toast_notification';
import { CREATE_EVENT, UPLOAD_IMAGE } from '../../../apis/sender';
import './create_event_tab.css';

export default function CreateEventTab({ userData, onTabChange }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSchedule, setNewSchedule] = useState({ time: '', event: '', description: '' });
  const [editingScheduleIndex, setEditingScheduleIndex] = useState(null);

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

  // Form State initialized with default structure matching event.model.js
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
    // Dates
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    // Location
    venueName: '',
    address: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    pincode: '',
    googleMapsLink: '',
    // Tickets & Pricing
    ticketPrice: 499,
    totalSeats: 250,
    availableSeats: 250,
    paymentUPI: '',
    paymentUPIName: '',
    paymentQr: '',
    // Organizer details
    organizerName: userData?.name || '',
    contactEmail: userData?.email || '',
    contactPhone: userData?.phone || '',
    website: '',
    // Social Links
    socialLinks: {
      instagram: '',
      facebook: '',
      linkedin: '',
      twitter: '',
      youtube: ''
    },
    // Speakers & FAQ & Schedule (initialized empty)
    speakers: [],
    faqs: [],
    schedule: [],
    refundPolicy: 'Full refund available up to 48 hours prior to event start time.',
    termsAndConditions: 'Attendees must carry a valid photo ID and e-ticket QR code for entry.',
    status: 'DRAFT'
  });

  const steps = [
    { id: 1, label: 'Basic Details' },
    { id: 2, label: 'Date & Time' },
    { id: 3, label: 'Location & Venue' },
    { id: 4, label: 'Tickets & Pricing' },
    { id: 5, label: 'Additional Details' },
    { id: 6, label: 'Review & Publish' }
  ];

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

  const handleAddSchedule = () => {
    if (!newSchedule.time.trim()) {
      ToastError('Session time is required!');
      return;
    }
    if (!newSchedule.event.trim()) {
      ToastError('Session title is required!');
      return;
    }
    if (!newSchedule.description.trim()) {
      ToastError('Session description is required!');
      return;
    }

    if (editingScheduleIndex !== null) {
      setFormData(prev => {
        const updated = [...prev.schedule];
        updated[editingScheduleIndex] = { ...newSchedule };
        return { ...prev, schedule: updated };
      });
      setEditingScheduleIndex(null);
      ToastSuccess('Session updated successfully!');
    } else {
      setFormData(prev => ({
        ...prev,
        schedule: [...(prev.schedule || []), { ...newSchedule }]
      }));
      ToastSuccess('Session added to schedule!');
    }
    setNewSchedule({ time: '', event: '', description: '' });
  };

  const handleEditSchedule = (index) => {
    const item = formData.schedule[index];
    setNewSchedule({ ...item });
    setEditingScheduleIndex(index);
  };

  const handleRemoveSchedule = (index) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, idx) => idx !== index)
    }));
    if (editingScheduleIndex === index) {
      setEditingScheduleIndex(null);
      setNewSchedule({ time: '', event: '', description: '' });
    }
    ToastSuccess('Session removed from schedule.');
  };

  // Upload Handler
  const handleImageUpload = async (e, field) => {
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
          ToastSuccess('Banner image uploaded successfully!');
        } else if (field === 'thumbnail') {
          handleInputChange('thumbnailImage', res.url);
          ToastSuccess('Thumbnail image uploaded successfully!');
        } else if (field === 'qr') {
          handleInputChange('paymentQr', res.url);
          ToastSuccess('Payment QR Code uploaded successfully!');
        }
      } else {
        ToastError(res.message || 'Failed to upload image.');
      }
    } catch (err) {
      console.error(err);
      ToastError('Error uploading image to server.');
    } finally {
      if (field === 'banner') setIsUploadingBanner(false);
      else if (field === 'thumbnail') setIsUploadingThumbnail(false);
      else if (field === 'qr') setIsUploadingQr(false);
    }
  };

  const handleGalleryUpload = async (e) => {
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
        console.error('Gallery image upload failed:', err);
      }
    }

    if (successCount > 0) {
      setFormData(prev => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...uploadedUrls]
      }));
      ToastSuccess(`Successfully uploaded ${successCount} gallery images!`);
    } else {
      ToastError('Failed to upload gallery images.');
    }
    setIsUploadingGallery(false);
  };

  const handleRemoveGalleryImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, idx) => idx !== indexToRemove)
    }));
    ToastSuccess('Removed gallery image.');
  };

  // Submit Helper (handles Draft and Published status)
  const submitEvent = async (finalStatus) => {
    // Validate Required Fields
    if (!formData.title.trim()) {
      ToastError('Event Title is required!');
      return;
    }
    if (!formData.shortDescription.trim()) {
      ToastError('Short Description is required!');
      return;
    }
    if (!formData.description.trim()) {
      ToastError('Detailed Description is required!');
      return;
    }
    if (!formData.category) {
      ToastError('Category is required!');
      return;
    }
    if (!formData.bannerImage) {
      ToastError('Event Banner Image is required! Please upload one from the media panel.');
      return;
    }
    if (!formData.startDate) {
      ToastError('Start Date & Time is required!');
      return;
    }
    if (!formData.endDate) {
      ToastError('End Date & Time is required!');
      return;
    }
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      ToastError('Event end date must be after start date!');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        status: finalStatus
      };
      
      const res = await CREATE_EVENT(payload);
      if (res.success) {
        ToastSuccess(finalStatus === 'PUBLISHED' ? '🎉 Event Published Successfully!' : 'Event saved as Draft successfully!');
        if (typeof onTabChange === 'function') {
          onTabChange('my_events');
        }
      } else {
        ToastError(res.message || 'Failed to save event.');
      }
    } catch (err) {
      console.error(err);
      ToastError('An error occurred while saving the event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    submitEvent('DRAFT');
  };

  const handlePublishEvent = () => {
    submitEvent('PUBLISHED');
  };

  const handleNextStep = () => {
    if (currentStep < 6) setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  return (
    <div className="create-event-tab-container">
      {/* Top Header Row */}
      <div className="create-event-header-row">
        <div>
          <h1 className="tab-title">Create New Event</h1>
          <p className="tab-subtitle">Fill in the details below to create your event. You can save as draft anytime.</p>
        </div>
        <div className="header-action-buttons">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handlePublishEvent}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Publishing...' : 'Publish Event'}
          </button>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="create-event-stepper-wrapper">
        <div className="stepper-steps-row">
          {steps.map((step, idx) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  className={`stepper-step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                  onClick={() => setCurrentStep(step.id)}
                >
                  <div className="step-circle">
                    {isCompleted ? (
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className="step-label">{step.label}</span>
                </button>
                {idx < steps.length - 1 && (
                  <div className={`step-connector-line ${currentStep > step.id ? 'active' : ''}`}></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left Form Column + Right Sidebar Preview */}
      <div className="create-event-layout-grid">
        {/* Form Column */}
        <div className="create-event-main-col">
          {/* STEP 1: Basic Details */}
          {currentStep === 1 && (
            <>
              <div className="form-section-card">
                <div className="section-card-header">
                  <h3 className="section-card-title">Basic Details</h3>
                  <p className="section-card-subtitle">Add the basic information about your event.</p>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      Event Title <span className="required-star">*</span>
                      <span className="char-counter">{formData.title.length}/100</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter event title"
                      maxLength={100}
                      value={formData.title}
                      onChange={e => handleInputChange('title', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Category <span className="required-star">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={e => handleInputChange('category', e.target.value)}
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
                  <label className="form-label">
                    Short Description <span className="required-star">*</span>
                    <span className="char-counter">{formData.shortDescription.length}/150</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Write a short description about your event"
                    maxLength={150}
                    value={formData.shortDescription}
                    onChange={e => handleInputChange('shortDescription', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Detailed Description <span className="required-star">*</span>
                    <span className="char-counter">{formData.description.length}/5000</span>
                  </label>
                  <textarea
                    className="form-textarea rich-editor-textarea"
                    placeholder="Tell people more about your event..."
                    maxLength={5000}
                    value={formData.description}
                    onChange={e => handleInputChange('description', e.target.value)}
                  ></textarea>
                </div>

                {/* Event Type Radio Cards */}
                <div className="form-group">
                  <label className="form-label">Event Access Type <span className="required-star">*</span></label>
                  <div className="event-type-grid">
                    <div
                      className={`event-type-card ${formData.eventType === 'PUBLIC' ? 'selected' : ''}`}
                      onClick={() => handleInputChange('eventType', 'PUBLIC')}
                    >
                      <div className="event-type-icon">🌐</div>
                      <div className="event-type-meta">
                        <h4>Public Event</h4>
                        <p>Anyone can view and book tickets</p>
                      </div>
                    </div>

                    <div
                      className={`event-type-card ${formData.eventType === 'PRIVATE' ? 'selected' : ''}`}
                      onClick={() => handleInputChange('eventType', 'PRIVATE')}
                    >
                      <div className="event-type-icon">🔒</div>
                      <div className="event-type-meta">
                        <h4>Private Event</h4>
                        <p>Only invited people can join</p>
                      </div>
                    </div>

                    <div
                      className={`event-type-card ${formData.eventType === 'ALL' ? 'selected' : ''}`}
                      onClick={() => handleInputChange('eventType', 'ALL')}
                    >
                      <div className="event-type-icon">👥</div>
                      <div className="event-type-meta">
                        <h4>All / Both</h4>
                        <p>Both public and private access</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Organizer Details Section */}
              <div className="form-section-card">
                <div className="section-card-header">
                  <h3 className="section-card-title">Organizer Details</h3>
                  <p className="section-card-subtitle">These details will be visible to attendees.</p>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Organizer Name <span className="required-star">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.organizerName}
                      onChange={e => handleInputChange('organizerName', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Email <span className="required-star">*</span></label>
                    <input
                      type="email"
                      className="form-input"
                      value={formData.contactEmail}
                      onChange={e => handleInputChange('contactEmail', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Phone</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.contactPhone}
                      onChange={e => handleInputChange('contactPhone', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Official Website</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.website}
                      onChange={e => handleInputChange('website', e.target.value)}
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
                <p className="section-card-subtitle">Specify when your event starts, ends, and registration deadlines.</p>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Start Date & Time <span className="required-star">*</span></label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={formData.startDate}
                    onChange={e => handleInputChange('startDate', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">End Date & Time <span className="required-star">*</span></label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={formData.endDate}
                    onChange={e => handleInputChange('endDate', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Registration Deadline</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={formData.registrationDeadline}
                    onChange={e => handleInputChange('registrationDeadline', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Location & Venue */}
          {currentStep === 3 && (
            <div className="form-section-card">
              <div className="section-card-header">
                <h3 className="section-card-title">Location & Venue Details</h3>
                <p className="section-card-subtitle">Provide physical venue info or Google Maps coordinates.</p>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Venue Name <span className="required-star">*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. KTPO Convention Center"
                    value={formData.venueName}
                    onChange={e => handleInputChange('venueName', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">City <span className="required-star">*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.city}
                    onChange={e => handleInputChange('city', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.state}
                    onChange={e => handleInputChange('state', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 400051"
                    value={formData.pincode}
                    onChange={e => handleInputChange('pincode', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Full Address</label>
                <textarea
                  className="form-textarea"
                  placeholder="Street address, building name, landmark..."
                  value={formData.address}
                  onChange={e => handleInputChange('address', e.target.value)}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Google Maps Link</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="https://maps.google.com/?q=..."
                  value={formData.googleMapsLink}
                  onChange={e => handleInputChange('googleMapsLink', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 4: Tickets & Pricing */}
          {currentStep === 4 && (
            <div className="form-section-card">
              <div className="section-card-header">
                <h3 className="section-card-title">Tickets & Seat Allocation</h3>
                <p className="section-card-subtitle">Set your ticket pricing, seat capacity, and payment UPI details.</p>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Ticket Price (₹) <span className="required-star">*</span></label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.ticketPrice}
                    onChange={e => handleInputChange('ticketPrice', Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Total Seats Capacity <span className="required-star">*</span></label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.totalSeats}
                    onChange={e => handleInputChange('totalSeats', Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Available Seats</label>
                  <input
                    type="number"
                    title='Seats after removing reserve seats'
                    className="form-input"
                    value={formData.availableSeats}
                    onChange={e => handleInputChange('availableSeats', Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Payment UPI ID</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. organizer@upi"
                    value={formData.paymentUPI}
                    onChange={e => handleInputChange('paymentUPI', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">UPI Payee Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Account holder name"
                    value={formData.paymentUPIName}
                    onChange={e => handleInputChange('paymentUPIName', e.target.value)}
                  />
                </div>
              </div>

              {/* Payment QR Upload */}
              <div className="form-group">
                <label className="form-label">Payment QR Code (Optional)</label>
                <input
                  type="file"
                  ref={qrInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'qr')}
                />
                {formData.paymentQr && !isUploadingQr ? (
                  <div className="uploaded-qr-container">
                    <img src={formData.paymentQr} alt="Payment QR" className="qr-preview-thumb" />
                    <button type="button" className="btn btn-secondary btn-xs mt-1" onClick={() => qrInputRef.current.click()}>
                      Change QR Code
                    </button>
                  </div>
                ) : (
                  <div className="upload-dropzone qr-upload" onClick={() => qrInputRef.current.click()}>
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
                  <p className="section-card-subtitle">Set refund rules, terms & conditions, and promotional videos.</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Promotional Video URL (YouTube / Vimeo)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="https://youtube.com/watch?v=..."
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
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Terms & Conditions</label>
                  <textarea
                    className="form-textarea"
                    value={formData.termsAndConditions}
                    onChange={e => handleInputChange('termsAndConditions', e.target.value)}
                  ></textarea>
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
                      />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Session / Event Title <span className="required-star">*</span></label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Opening Keynote & Speaker Introduction"
                        value={newSchedule.event}
                        onChange={e => setNewSchedule(prev => ({ ...prev, event: e.target.value }))}
                      />
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
                    ></textarea>
                  </div>

                  <div className="schedule-form-actions mt-2" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    {editingScheduleIndex !== null && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setEditingScheduleIndex(null);
                          setNewSchedule({ time: '', event: '', description: '' });
                        }}
                      >
                        Cancel Edit
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleAddSchedule}
                    >
                      {editingScheduleIndex !== null ? '✏️ Update Session' : '＋ Add Session to Schedule'}
                    </button>
                  </div>
                </div>

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
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* STEP 6: Review & Publish */}
          {currentStep === 6 && (
            <div className="form-section-card">
              <div className="section-card-header">
                <h3 className="section-card-title">Review & Final Settings</h3>
                <p className="section-card-subtitle">Review all your entered information before saving.</p>
              </div>

              <div className="form-grid-2">
                <div>
                  <strong>Title:</strong> {formData.title || 'Untitled Event'}
                </div>
                <div>
                  <strong>Category:</strong> {formData.category}
                </div>
                <div>
                  <strong>Price:</strong> ₹{formData.ticketPrice}
                </div>
                <div>
                  <strong>Venue:</strong> {formData.venueName || 'N/A'}, {formData.city}
                </div>
              </div>

              {/* Status Field Dropdown */}
              <div className="form-group mt-2">
                <label className="form-label">
                  Event Status <span className="required-star">*</span>
                </label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={e => handleInputChange('status', e.target.value)}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
                <p className="form-help-text" style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Newly created events are saved in <strong>Draft</strong> mode by default. Change this to <strong>Published</strong> to make your event public immediately upon save.
                </p>
              </div>

              <p className="tab-subtitle mt-2">Ready to save? You can save as Draft or Publish directly.</p>
            </div>
          )}

          {/* Step Footer Navigation */}
          <div className="step-navigation-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onTabChange && onTabChange('my_events')}
            >
              Cancel
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              {currentStep > 1 && (
                <button type="button" className="btn btn-secondary" onClick={handlePrevStep}>
                  Previous
                </button>
              )}

              {currentStep < 6 ? (
                <button type="button" className="btn btn-primary" onClick={handleNextStep}>
                  Next: {steps[currentStep]?.label || 'Next'} →
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => submitEvent(formData.status)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving Event...' : 'Save & Exit'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar Column (Media & Live Preview) */}
        <div className="create-event-sidebar-col">
          {/* Media Images Card */}
          <div className="form-section-card media-upload-card">
            <h4 className="tips-title">Event Banner Image *</h4>
            <input
              type="file"
              ref={bannerInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'banner')}
            />
            {formData.bannerImage && !isUploadingBanner ? (
              <div className="uploaded-image-container">
                <img src={formData.bannerImage} alt="Banner" className="image-preview-thumb" />
                <button type="button" className="btn btn-secondary btn-xs change-image-btn" onClick={() => bannerInputRef.current.click()}>
                  Change Banner
                </button>
              </div>
            ) : (
              <div className="upload-dropzone" onClick={() => bannerInputRef.current.click()}>
                <div className="upload-icon-circle">
                  {isUploadingBanner ? <div className="spinner"></div> : '📷'}
                </div>
                <span className="upload-hint-title">{isUploadingBanner ? 'Uploading...' : 'Upload Banner Image'}</span>
                <span className="upload-hint-sub">Recommended: 1200 x 630px (Max 5MB)</span>
              </div>
            )}

            <h4 className="tips-title mt-2">Thumbnail Image</h4>
            <input
              type="file"
              ref={thumbnailInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'thumbnail')}
            />
            {formData.thumbnailImage && !isUploadingThumbnail ? (
              <div className="uploaded-image-container">
                <img src={formData.thumbnailImage} alt="Thumbnail" className="image-preview-thumb" />
                <button type="button" className="btn btn-secondary btn-xs change-image-btn" onClick={() => thumbnailInputRef.current.click()}>
                  Change Thumbnail
                </button>
              </div>
            ) : (
              <div className="upload-dropzone" onClick={() => thumbnailInputRef.current.click()}>
                <div className="upload-icon-circle">
                  {isUploadingThumbnail ? <div className="spinner"></div> : '🖼️'}
                </div>
                <span className="upload-hint-title">{isUploadingThumbnail ? 'Uploading...' : 'Upload Thumbnail'}</span>
                <span className="upload-hint-sub">Recommended: 600 x 400px</span>
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
            />
            <div className="gallery-section">
              <div className="gallery-grid">
                {formData.galleryImages.map((img, idx) => (
                  <div key={idx} className="gallery-item-wrap">
                    <img src={img} alt={`Gallery ${idx}`} className="gallery-img-thumb" />
                    <button type="button" className="gallery-remove-btn" onClick={() => handleRemoveGalleryImage(idx)}>
                      ×
                    </button>
                  </div>
                ))}
                {!isUploadingGallery ? (
                  <div className="gallery-add-card" onClick={() => galleryInputRef.current.click()}>
                    <span className="plus-sign">+</span>
                  </div>
                ) : (
                  <div className="gallery-add-card loading-card">
                    <div className="spinner sm"></div>
                  </div>
                )}
              </div>
              <p className="upload-hint-sub mt-1">Upload multiple photos of venue/previous events.</p>
            </div>
          </div>

          {/* Live Publishing Preview Card */}
          <div className="live-preview-card">
            <div className="preview-card-header">Live Publishing Preview</div>
            <div className="preview-banner-wrap">
              {formData.bannerImage ? (
                <img
                  src={formData.bannerImage}
                  alt="Banner Preview"
                  className="preview-banner-img"
                />
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
                {formData.shortDescription || 'Short description of your event will appear here...'}
              </p>

              <div className="preview-meta-row">
                <span>📅 {formData.startDate ? new Date(formData.startDate).toLocaleString() : 'Date & Time'}</span>
              </div>
              <div className="preview-meta-row">
                <span>📍 {formData.venueName || 'Venue'}, {formData.city}</span>
              </div>

              <div className="preview-organizer-row">
                <span>By <strong>{formData.organizerName || 'Organizer'}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
