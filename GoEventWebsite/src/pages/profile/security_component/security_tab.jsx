import React, { useState } from 'react';
import { ToastSuccess, ToastError } from '../../../utils/toast_notification';

export default function SecurityTab({ theme }) {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      ToastError("New password and confirm password don't match!", theme);
      return;
    }
    if (passwords.newPassword.length < 6) {
      ToastError("Password must be at least 6 characters long!", theme);
      return;
    }

    ToastSuccess("Password updated successfully!", theme);
    setPasswords({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleToggle2FA = () => {
    const nextVal = !twoFactorEnabled;
    setTwoFactorEnabled(nextVal);
    if (nextVal) {
      ToastSuccess("Two-Factor Authentication enabled!", theme);
    } else {
      ToastSuccess("Two-Factor Authentication disabled!", theme);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("WARNING: Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone.")) {
      const confirmation = window.prompt("Type 'DELETE MY ACCOUNT' to confirm account deletion:");
      if (confirmation === 'DELETE MY ACCOUNT') {
        ToastSuccess("Account deleted. Redirecting...", theme);
      } else {
        ToastError("Account deletion cancelled (incorrect confirmation text).", theme);
      }
    }
  };

  return (
    <div className="security-tab-container">
      <div className="tab-header-row">
        <div>
          <h2 className="tab-title">Security</h2>
          <p className="tab-subtitle">Update your password, enable multi-factor security, and manage your account state</p>
        </div>
      </div>

      <div className="security-layout-grid">
        
        {/* Form: Password Change */}
        <form onSubmit={handlePasswordSubmit} className="profile-card security-form-card">
          <h3 className="card-title">Change Password</h3>
          <div className="form-group mb-4">
            <label htmlFor="currentPassword" className="form-label">Current Password</label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              className="form-input"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="newPassword" className="form-label">New Password</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              className="form-input"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              className="form-input"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary mt-2">
            Update Password
          </button>
        </form>

        {/* Column: 2FA & Account Management */}
        <div className="security-right-col">
          
          {/* Card: 2FA */}
          <div className="profile-card security-card">
            <h3 className="card-title">Two-Factor Authentication</h3>
            <p className="section-description">
              Two-factor authentication adds an extra layer of protection by requiring a verification code when logging in.
            </p>
            
            <div className="toggle-setting-row">
              <div className="toggle-label-group">
                <span className="toggle-title">Verify via Authenticator App</span>
                <span className="toggle-desc">Google Authenticator, Microsoft Authenticator, or Duo</span>
              </div>
              <button 
                type="button" 
                onClick={handleToggle2FA}
                className={`switch-toggle-btn ${twoFactorEnabled ? 'active' : ''}`}
                aria-label="Toggle 2FA"
              >
                <span className="switch-slider"></span>
              </button>
            </div>
          </div>

          {/* Card: Danger Zone */}
          <div className="profile-card danger-zone-card">
            <h3 className="card-title text-danger">Danger Zone</h3>
            <p className="section-description">
              Permanently delete your GoEvent account. All active ticket bookings, hosted events, and transaction history will be permanently wiped.
            </p>
            <div className="danger-action-row">
              <button 
                type="button" 
                className="btn btn-secondary border-danger text-danger hover-danger"
                onClick={handleDeleteAccount}
              >
                Delete My Account
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
