import React, { useState } from 'react';
import { ToastSuccess } from '../../../utils/toast_notification';

export default function NotificationTab({ theme }) {
  const [emailPrefs, setEmailPrefs] = useState({
    bookings: true,
    updates: true,
    marketing: false
  });

  const [pushPrefs, setPushPrefs] = useState({
    reminders: true,
    messages: true,
    system: false
  });

  const handleEmailToggle = (key) => {
    setEmailPrefs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePushToggle = (key) => {
    setPushPrefs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    ToastSuccess("Notification preferences saved!", theme);
  };

  return (
    <div className="notification-tab-container">
      <div className="tab-header-row">
        <div>
          <h2 className="tab-title">Notifications</h2>
          <p className="tab-subtitle">Configure email and mobile push alerts to keep track of your events</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="notifications-form-layout">
        
        {/* Email Notifications */}
        <div className="profile-card notifications-section-card">
          <h3 className="card-title">Email Notifications</h3>
          <p className="section-description">Decide what updates you'd like to receive in your inbox.</p>
          
          <div className="checkbox-options-list">
            
            <div className="checkbox-option-row" onClick={() => handleEmailToggle('bookings')}>
              <div className="checkbox-box-container">
                <input 
                  type="checkbox" 
                  checked={emailPrefs.bookings} 
                  onChange={() => {}} 
                  className="hidden-checkbox"
                />
                <span className={`custom-checkbox-display ${emailPrefs.bookings ? 'checked' : ''}`}>
                  {emailPrefs.bookings && (
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </span>
              </div>
              <div className="checkbox-label-group">
                <span className="checkbox-title">New Bookings & Sales</span>
                <span className="checkbox-desc">Receive instant notifications when customers buy tickets to your hosted events.</span>
              </div>
            </div>

            <div className="checkbox-option-row" onClick={() => handleEmailToggle('updates')}>
              <div className="checkbox-box-container">
                <input 
                  type="checkbox" 
                  checked={emailPrefs.updates} 
                  onChange={() => {}} 
                  className="hidden-checkbox"
                />
                <span className={`custom-checkbox-display ${emailPrefs.updates ? 'checked' : ''}`}>
                  {emailPrefs.updates && (
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </span>
              </div>
              <div className="checkbox-label-group">
                <span className="checkbox-title">Booked Event Updates</span>
                <span className="checkbox-desc">Receive schedule notifications or cancellations for events you are attending.</span>
              </div>
            </div>

            <div className="checkbox-option-row" onClick={() => handleEmailToggle('marketing')}>
              <div className="checkbox-box-container">
                <input 
                  type="checkbox" 
                  checked={emailPrefs.marketing} 
                  onChange={() => {}} 
                  className="hidden-checkbox"
                />
                <span className={`custom-checkbox-display ${emailPrefs.marketing ? 'checked' : ''}`}>
                  {emailPrefs.marketing && (
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </span>
              </div>
              <div className="checkbox-label-group">
                <span className="checkbox-title">Marketing & Promos</span>
                <span className="checkbox-desc">Receive news about upcoming events, platform features, and exclusive discount coupons.</span>
              </div>
            </div>

          </div>
        </div>

        {/* Push Notifications */}
        <div className="profile-card notifications-section-card">
          <h3 className="card-title">Push Notifications</h3>
          <p className="section-description">Configure notifications displayed on your device or browser windows.</p>

          <div className="checkbox-options-list">
            
            <div className="checkbox-option-row" onClick={() => handlePushToggle('reminders')}>
              <div className="checkbox-box-container">
                <input 
                  type="checkbox" 
                  checked={pushPrefs.reminders} 
                  onChange={() => {}} 
                  className="hidden-checkbox"
                />
                <span className={`custom-checkbox-display ${pushPrefs.reminders ? 'checked' : ''}`}>
                  {pushPrefs.reminders && (
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </span>
              </div>
              <div className="checkbox-label-group">
                <span className="checkbox-title">Event Reminders</span>
                <span className="checkbox-desc">Get alert reminders 24 hours and 1 hour before your booked events begin.</span>
              </div>
            </div>

            <div className="checkbox-option-row" onClick={() => handlePushToggle('messages')}>
              <div className="checkbox-box-container">
                <input 
                  type="checkbox" 
                  checked={pushPrefs.messages} 
                  onChange={() => {}} 
                  className="hidden-checkbox"
                />
                <span className={`custom-checkbox-display ${pushPrefs.messages ? 'checked' : ''}`}>
                  {pushPrefs.messages && (
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </span>
              </div>
              <div className="checkbox-label-group">
                <span className="checkbox-title">Direct Messages & Chats</span>
                <span className="checkbox-desc">Get notified when a customer or event organizer sends you a direct chat message.</span>
              </div>
            </div>

            <div className="checkbox-option-row" onClick={() => handlePushToggle('system')}>
              <div className="checkbox-box-container">
                <input 
                  type="checkbox" 
                  checked={pushPrefs.system} 
                  onChange={() => {}} 
                  className="hidden-checkbox"
                />
                <span className={`custom-checkbox-display ${pushPrefs.system ? 'checked' : ''}`}>
                  {pushPrefs.system && (
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </span>
              </div>
              <div className="checkbox-label-group">
                <span className="checkbox-title">System & Security Alerts</span>
                <span className="checkbox-desc">Get notifications for suspicious account logins, payment flags, or policy updates.</span>
              </div>
            </div>

          </div>
        </div>

        {/* Submit Button */}
        <div className="settings-submit-bar">
          <button type="submit" className="btn btn-primary">
            Save Preferences
          </button>
        </div>

      </form>
    </div>
  );
}
