import React, { useState } from 'react';
import { getAvatarPath } from '../../../utils/avatar_utils';
import { ToastSuccess } from '../../../utils/toast_notification';

export default function ProfileSettingsTab({ userData, onSave, theme }) {
  const [formData, setFormData] = useState({
    name: userData.name || 'John Doe',
    email: userData.email || 'john.doe@example.com',
    phone: userData.phone || '+91 98765 43210',
    location: userData.location || 'Mumbai, Maharashtra, India',
    bio: userData.bio || 'Passionate event organizer with 3+ years of experience creating memorable events.',
    website: userData.website || 'www.johndoeevents.com',
    avatar: userData.avatar !== undefined ? userData.avatar : 1,
    socials: {
      instagram: userData.socials?.instagram || 'johndoe_org',
      facebook: userData.socials?.facebook || 'johndoe.events',
      linkedin: userData.socials?.linkedin || 'john-doe-events',
      twitter: userData.socials?.twitter || 'johndoe_events'
    }
  });

  const [avatarOpen, setAvatarOpen] = useState(false);

  // Available avatars list [1 to 16]
  const avatarList = Array.from({ length: 16 }, (_, i) => i + 1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socials: {
        ...prev.socials,
        [name]: value
      }
    }));
  };

  const handleAvatarSelect = (idx) => {
    setFormData(prev => ({
      ...prev,
      avatar: idx
    }));
    setAvatarOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    ToastSuccess('Profile updated successfully!', theme);
  };

  return (
    <div className="profile-settings-tab-container">
      <div className="tab-header-row">
        <div>
          <h2 className="tab-title">Profile Settings</h2>
          <p className="tab-subtitle">Update your personal details, biography, and social handles</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="settings-form-layout">
        
        {/* Avatar Selection Area */}
        <div className="avatar-selection-card">
          <div className="current-avatar-container">
            <img
              src={getAvatarPath(formData.avatar)}
              alt="Current Avatar"
              className="avatar-large-preview"
            />
            <div className="avatar-actions">
              <h4>Profile Picture</h4>
              <p>Choose from our premium pre-built avatars to display on your profile.</p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setAvatarOpen(!avatarOpen)}
              >
                {avatarOpen ? 'Close Selector' : 'Change Avatar'}
              </button>
            </div>
          </div>

          {avatarOpen && (
            <div className="avatar-grid-dropdown">
              <p className="avatar-grid-title">Select an Avatar:</p>
              <div className="avatar-thumbnails-grid">
                {avatarList.map(num => (
                  <button
                    key={num}
                    type="button"
                    className={`avatar-thumb-btn ${formData.avatar === num ? 'selected' : ''}`}
                    onClick={() => handleAvatarSelect(num)}
                  >
                    <img src={getAvatarPath(num)} alt={`Avatar ${num}`} className="avatar-thumb-img" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Details Inputs */}
        <div className="profile-card form-section-card">
          <h3 className="card-title">Personal Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location" className="form-label">Location</label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleInputChange}
                className="form-input"
                placeholder="City, State, Country"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="website" className="form-label">Website</label>
              <input
                id="website"
                name="website"
                type="text"
                value={formData.website}
                onChange={handleInputChange}
                className="form-input"
                placeholder="www.yourdomain.com"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="bio" className="form-label">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="form-input form-textarea"
                placeholder="Tell us a little bit about yourself, your hobbies, or what events you host..."
                rows="4"
              />
            </div>
          </div>
        </div>

        {/* Social Media Inputs */}
        <div className="profile-card form-section-card">
          <h3 className="card-title">Social Handles</h3>
          <p className="section-description">Link your profile to your social networks for other attendees to connect.</p>
          <div className="form-grid">
            
            <div className="form-group">
              <label htmlFor="instagram" className="form-label">Instagram Username</label>
              <div className="input-prefix-wrapper">
                <span className="input-prefix">@</span>
                <input
                  id="instagram"
                  name="instagram"
                  type="text"
                  value={formData.socials.instagram}
                  onChange={handleSocialChange}
                  className="form-input with-prefix"
                  placeholder="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="facebook" className="form-label">Facebook Profile Link</label>
              <div className="input-prefix-wrapper">
                <span className="input-prefix">fb.com/</span>
                <input
                  id="facebook"
                  name="facebook"
                  type="text"
                  value={formData.socials.facebook}
                  onChange={handleSocialChange}
                  className="form-input with-prefix"
                  placeholder="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="linkedin" className="form-label">LinkedIn Profile URL</label>
              <div className="input-prefix-wrapper">
                <span className="input-prefix">in/</span>
                <input
                  id="linkedin"
                  name="linkedin"
                  type="text"
                  value={formData.socials.linkedin}
                  onChange={handleSocialChange}
                  className="form-input with-prefix"
                  placeholder="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="twitter" className="form-label">Twitter / X Username</label>
              <div className="input-prefix-wrapper">
                <span className="input-prefix">@</span>
                <input
                  id="twitter"
                  name="twitter"
                  type="text"
                  value={formData.socials.twitter}
                  onChange={handleSocialChange}
                  className="form-input with-prefix"
                  placeholder="username"
                />
              </div>
            </div>
            
          </div>
        </div>

        {/* Submit Bar */}
        <div className="settings-submit-bar">
          <button type="submit" className="btn btn-primary">
            Save Profile Changes
          </button>
        </div>

      </form>
    </div>
  );
}
