import React, { useState } from 'react';
import { ToastSuccess, ToastError } from '../../../utils/toast_notification';
import './create_event_tab.css';

export default function CreateEventTab({ userData, onTabChange }) {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State initialized with default structure matching event.model.js
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: 'Concert & Music',
    eventType: 'PUBLIC',
    bannerImage: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop',
    thumbnailImage: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=600&auto=format&fit=crop',
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
    organizerName: userData?.name || 'John Doe',
    contactEmail: userData?.email || 'john@example.com',
    contactPhone: userData?.phone || '+91 9876543210',
    website: 'https://yourwebsite.com',
    // Social Links
    socialLinks: {
      instagram: '',
      facebook: '',
      linkedin: '',
      twitter: '',
      youtube: ''
    },
    // Speakers & FAQ & Schedule
    speakers: [
      { name: 'Dr. Rahul Sharma', designation: 'Keynote Speaker', company: 'Tech Corp', bio: 'AI & Web3 Innovator' }
    ],
    faqs: [
      { question: 'Is parking available at the venue?', answer: 'Yes, free parking is available for all ticket holders.' }
    ],
    schedule: [
      { time: '10:00 AM', event: 'Keynote Opening', description: 'Welcome address and opening remarks.' }
    ],
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

  const handleSaveDraft = () => {
    ToastSuccess('Event saved as Draft successfully!');
  };

  const handlePublishEvent = () => {
    if (!formData.title || !formData.shortDescription) {
      ToastError('Please fill in the Event Title and Short Description before publishing.');
      return;
    }
    ToastSuccess('🎉 Event Published Successfully!');
    if (typeof onTabChange === 'function') {
      onTabChange('my_events');
    }
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
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleSaveDraft}>
            Save Draft
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={handlePublishEvent}>
            Publish Event
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
                  <div className="rich-editor-toolbar">
                    <button type="button" className="editor-btn">B</button>
                    <button type="button" className="editor-btn">I</button>
                    <button type="button" className="editor-btn">U</button>
                    <button type="button" className="editor-btn">List</button>
                    <button type="button" className="editor-btn">Link</button>
                  </div>
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
            </div>
          )}

          {/* STEP 5: Additional Details */}
          {currentStep === 5 && (
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
          )}

          {/* STEP 6: Review & Publish */}
          {currentStep === 6 && (
            <div className="form-section-card">
              <div className="section-card-header">
                <h3 className="section-card-title">Review & Final Publish</h3>
                <p className="section-card-subtitle">Review all your entered information before making your event live.</p>
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

              <p className="tab-subtitle mt-2">Ready to publish? Click "Publish Event" to start accepting ticket bookings.</p>
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
                <button type="button" className="btn btn-primary" onClick={handlePublishEvent}>
                  Publish Event Now
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar Column (Media & Live Preview) */}
        <div className="create-event-sidebar-col">
          {/* Media Images Card */}
          <div className="form-section-card">
            <h4 className="tips-title">Event Banner Image *</h4>
            <div className="upload-dropzone">
              <div className="upload-icon-circle">📷</div>
              <span className="upload-hint-title">Upload Banner Image</span>
              <span className="upload-hint-sub">Recommended: 1200 x 630px (Max 5MB)</span>
            </div>

            <h4 className="tips-title mt-2">Thumbnail Image</h4>
            <div className="upload-dropzone">
              <div className="upload-icon-circle">🖼️</div>
              <span className="upload-hint-title">Upload Thumbnail</span>
              <span className="upload-hint-sub">Recommended: 600 x 400px</span>
            </div>
          </div>

          {/* Live Publishing Preview Card */}
          <div className="live-preview-card">
            <div className="preview-card-header">Publishing Preview</div>
            <div className="preview-banner-wrap">
              <img
                src={formData.bannerImage}
                alt="Banner Preview"
                className="preview-banner-img"
              />
              <span className="preview-category-badge">{formData.category}</span>
            </div>
            <div className="preview-body">
              <h4 className="preview-title">{formData.title || 'Event Title Preview'}</h4>
              <p className="preview-short-desc">
                {formData.shortDescription || 'Short description of your event will appear here...'}
              </p>

              <div className="preview-meta-row">
                <span>📅 Date & Time</span>
              </div>
              <div className="preview-meta-row">
                <span>📍 {formData.venueName || 'Venue'}, {formData.city}</span>
              </div>

              <div className="preview-organizer-row">
                <span>By <strong>{formData.organizerName}</strong></span>
              </div>
            </div>
          </div>

          {/* Tips for a Great Event Card */}
          <div className="tips-card">
            <h4 className="tips-title">Tips for a Great Event</h4>
            <div className="tips-list">
              <div className="tip-item">
                <span className="tip-icon">✓</span> Use a clear and catchy title
              </div>
              <div className="tip-item">
                <span className="tip-icon">✓</span> Add high-quality banner images
              </div>
              <div className="tip-item">
                <span className="tip-icon">✓</span> Write detailed description
              </div>
              <div className="tip-item">
                <span className="tip-icon">✓</span> Set a fair ticket price
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
