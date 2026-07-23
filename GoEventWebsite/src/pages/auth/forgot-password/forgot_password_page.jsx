import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './forgot_password_page.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Only UI functionality, redirecting to OTP verification page for demo flow
    console.log({ email });
    navigate('/verify-otp');
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">

        {/* LEFT PANEL - Welcome & Features (Visible on Desktop) */}
        <div className="auth-left-panel">
          <div className="auth-left-overlay"></div>
          <div className="auth-left-content">
            {/* Logo */}
            <div className="auth-logo">
              <svg viewBox="0 0 24 24" width="32" height="32" className="logo-icon">
                <path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="logo-text">GoEvent</span>
            </div>

            <div className="auth-welcome-text">
              <h2>Reset Your Password</h2>
              <h3>We've got you covered</h3>
              <p>
                Don't worry! Just enter your registered email address and we'll send you an OTP code to verify and reset your password.
              </p>
            </div>

            {/* Features List */}
            <div className="auth-features">
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                  </svg>
                </div>
                <div className="feature-text">
                  <h4>Secure Recovery</h4>
                  <p>Encrypted one-time codes ensure safety.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M22 5.18v14c0 1-.79 1.82-1.78 1.82H3.78c-1 0-1.78-.82-1.78-1.82v-14c0-1 .79-1.82 1.78-1.82h16.44c1 0 1.78.82 1.78 1.82zM4 6.82v10.36l6.23-5.18L4 6.82zm16 0L13.77 12l6.23 5.18V6.82zM12 13.5l6.89-5.74H5.11L12 13.5z" />
                  </svg>
                </div>
                <div className="feature-text">
                  <h4>Instant Delivery</h4>
                  <p>Receive your verification code in seconds.</p>
                </div>
              </div>
            </div>

            <div className="auth-left-footer">
              <p>&copy; {new Date().getFullYear()} GoEvent. All rights reserved.</p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Forgot Password Form */}
        <div className="auth-right-panel">
          {/* Header Link for Mobile/Tablet */}
          <div className="auth-right-header">
            <div className="mobile-logo">
              <svg viewBox="0 0 24 24" width="28" height="28" className="logo-icon">
                <path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span>GoEvent</span>
            </div>
            <span className="signup-prompt">
              Remember password? <Link to="/login" className="auth-link font-bold">Log In</Link>
            </span>
          </div>

          <div className="auth-form-container">
            {/* Top illustration for Mobile view */}
            <div className="mobile-illustration-container">
              <svg viewBox="0 0 200 130" className="mobile-illustration">
                <defs>
                  <linearGradient id="purpleGradForgot" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8274E6" />
                    <stop offset="100%" stopColor="#6C5DD3" />
                  </linearGradient>
                  <linearGradient id="glowGradForgot" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#6C5DD3" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#6C5DD3" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Glow */}
                <circle cx="100" cy="65" r="40" fill="url(#glowGradForgot)" />
                {/* Key graphic */}
                <rect x="80" y="45" width="40" height="24" rx="4" fill="url(#purpleGradForgot)" />
                <circle cx="90" cy="57" r="5" fill="#FFFFFF" />
                <rect x="110" y="52" width="25" height="8" rx="2" fill="url(#purpleGradForgot)" />
                <rect x="120" y="58" width="6" height="10" rx="1" fill="url(#purpleGradForgot)" />
                <rect x="128" y="58" width="6" height="10" rx="1" fill="url(#purpleGradForgot)" />
                {/* Floating sparkles */}
                <path d="M65 40l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="#00C285" />
                <path d="M145 80l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5z" fill="#FFB03A" />
              </svg>
              <h3>Reset Password</h3>
              <p>Get a verification code to your email</p>
            </div>

            <div className="auth-form-title">
              <h2>Forgot Password?</h2>
              <p>Enter your email address and we'll send you an OTP to reset your password</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    id="email"
                    className="form-input"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary auth-submit-btn">
                Send OTP Code
              </button>

              {/* Back to Login link */}
              <div className="auth-back-link-wrapper">
                <Link to="/login" className="auth-back-link">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Back to Log In
                </Link>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
