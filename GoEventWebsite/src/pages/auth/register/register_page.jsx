import { useState } from 'react';
import { Link } from 'react-router-dom';
import './register_page.css';
import VerifyOtpPage from '../verify-otp/verify_otp_page';

export default function RegisterPage({ setIsUserLoggedIn }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('USER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [errorTag, setErrorTag] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDataFiled, setIsDataField] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorTag(""); setErrorMessage("");
    if (!name) {
      setErrorTag("name"); setErrorMessage("Please enter your name"); return;
    }
    if (!email) {
      setErrorTag("email"); setErrorMessage("Please enter your email"); return;
    }
    if (!password) {
      setErrorTag("password"); setErrorMessage("Please enter your password"); return;
    }
    if (!confirmPassword) {
      setErrorTag("confirm-password"); setErrorMessage("Please enter your confirm password"); return;
    }
    if (!role) {
      setErrorTag("role"); setErrorMessage("Please select your role"); return;
    }
    if (!agreeTerms) {
      setErrorTag("term"); setErrorMessage("Please agree to the terms and conditions"); return;
    }
    if (password !== confirmPassword) {
      setErrorTag("confirm-password"); setErrorMessage("Password and confirm password do not match"); return;
    }
    if (password.length < 8) {
      setErrorTag("password"); setErrorMessage("Password must be at least 8 characters long"); return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setErrorTag("email"); setErrorMessage("Please enter a valid email address"); return;
    }
    if (!name.match(/^[a-zA-Z]+$/)) {
      setErrorTag("name"); setErrorMessage("Please enter a valid name"); return;
    }

    setIsDataField(true);
  };

  return (
    <>
      {(isDataFiled == true) ?
        <VerifyOtpPage userData={{ name, email, password, role, task: "register" }} setIsUserLoggedIn={setIsUserLoggedIn} setIsDataField={setIsDataField} setErrorTag={setErrorTag} setErrorMessage={setErrorMessage} />
        :
        <div className="auth-container">
          <div className="auth-wrapper">

            {/* LEFT PANEL - Welcome & Features (Visible on Desktop) */}
            <div className="auth-left-panel">
              <div className="auth-left-overlay"></div>
              <div className="auth-left-content">
                {/* Logo */}
                <div className="auth-logo">
                  {/* <svg viewBox="0 0 24 24" width="32" height="32" className="logo-icon">
                    <path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  <span className="logo-text">GoEvent</span> */}
                </div>

                <div className="auth-welcome-text">
                  <h2>Join GoEvent Today</h2>
                  <h3>Start your journey with us</h3>
                  <p>
                    Create your account to discover amazing events, book tickets, and manage your experiences effortlessly.
                  </p>
                </div>

                {/* Features List */}
                <div className="auth-features">
                  <div className="feature-item">
                    <div className="feature-icon-wrapper">
                      <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="currentColor" d="M12 11c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6 10.5c0-2.5-5-3.5-6-3.5s-6 1-6 3.5v.5h12v-.5z" />
                      </svg>
                    </div>
                    <div className="feature-text">
                      <h4>Personalized Profile</h4>
                      <p>Save events, follow organizers, and track bookings.</p>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-icon-wrapper">
                      <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z" />
                      </svg>
                    </div>
                    <div className="feature-text">
                      <h4>24/7 Live Support</h4>
                      <p>Get round-the-clock help for ticket inquiries.</p>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-icon-wrapper">
                      <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </div>
                    <div className="feature-text">
                      <h4>Rate & Share</h4>
                      <p>Review events and share experiences with friends.</p>
                    </div>
                  </div>
                </div>

                <div className="auth-left-footer">
                  <p>&copy; {new Date().getFullYear()} GoEvent. All rights reserved.</p>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL - Register Form */}
            <div className="auth-right-panel">
              {/* Header Link for Mobile/Tablet */}
              <div className="auth-right-header">
                <div className="mobile-logo">
                  {/* <svg viewBox="0 0 24 24" width="28" height="28" className="logo-icon">
                    <path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  <span>GoEvent</span> */}
                </div>
                <span className="signup-prompt">
                  Already have an account? <Link to="/login" className="auth-link font-bold">Log In</Link>
                </span>
              </div>

              <div className="auth-form-container">
                {/* Top illustration for Mobile view */}
                <div className="mobile-illustration-container">
                  <svg viewBox="0 0 200 130" className="mobile-illustration">
                    <defs>
                      <linearGradient id="purpleGradReg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8274E6" />
                        <stop offset="100%" stopColor="#6C5DD3" />
                      </linearGradient>
                      <linearGradient id="glowGradReg" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#6C5DD3" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#6C5DD3" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Glow */}
                    <circle cx="100" cy="65" r="40" fill="url(#glowGradReg)" />
                    {/* Ticket outline */}
                    <path d="M60 40h80c5 0 9 4 9 9v10c-5 0-8 4-8 8s3 8 8 8v10c0 5-4 9-9 9H60c-5 0-9-4-9-9V75c5 0 8-4 8-8s-3-8-8-8V49c0-5 4-9 9-9z" fill="var(--bg-card)" stroke="var(--border-color)" strokeWidth="3" />
                    {/* Dashed line */}
                    <line x1="85" y1="45" x2="85" y2="85" stroke="var(--border-color)" strokeWidth="2" strokeDasharray="4 4" />
                    {/* Tiny star / sparkle */}
                    <path d="M125 50l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5z" fill="#FFB03A" />
                    <path d="M70 75l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="#00C285" />
                    {/* User circle profile in ticket */}
                    <circle cx="110" cy="67" r="14" fill="url(#purpleGradReg)" />
                    <circle cx="110" cy="63" r="5" fill="#FFFFFF" />
                    <path d="M101 76.5c0-3 3-5 9-5s9 2 9 5" fill="#FFFFFF" />
                  </svg>
                  <h3>Join GoEvent</h3>
                  <p>Create account to get started</p>
                </div>

                <div className="auth-form-title">
                  <h2>Register to GoEvent</h2>
                  <p>Enter your details to create an account</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                  {/* Full Name Field */}
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <div className="input-with-icon">
                      <span className="input-icon">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </span>
                      <input
                        type="text" id="name" className="form-input" placeholder="Enter your full name"
                        value={name} onChange={(e) => setName(e.target.value)} required
                      />
                    </div>
                    {errorTag == "name" && <span className="error-message">{errorMessage}</span>}
                  </div>

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
                        type="email" id="email" className="form-input" placeholder="Enter your email"
                        value={email} onChange={(e) => setEmail(e.target.value)} required
                      />
                    </div>
                    {errorTag == "email" && <span className="error-message">{errorMessage}</span>}
                  </div>

                  {/* Password Field */}
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-with-icon">
                      <span className="input-icon">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'} id="password" className="form-input" placeholder="Create a strong password"
                        value={password} onChange={(e) => setPassword(e.target.value)} required
                      />

                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex="-1"
                      >
                        {showPassword ? (
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errorTag == "password" && <span className="error-message">{errorMessage}</span>}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="input-with-icon">
                      <span className="input-icon">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </span>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        className="form-input"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        tabIndex="-1"
                      >
                        {showConfirmPassword ? (
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errorTag == "confirm-password" && <span className="error-message">{errorMessage}</span>}
                  </div>

                  {/* User type Field */}
                  <div className="form-group">
                    <label>User Type</label>
                    <div className="input-with-icon">
                      <span className="input-icon">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                      </span>
                      <select
                        className="form-input"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <option value="USER">USER</option>
                        <option value="HOST">HOST</option>
                      </select>
                    </div>
                    {errorTag == "role" && <span className="error-message">{errorMessage}</span>}
                  </div>

                  {/* Agree to terms Checkbox */}
                  {errorTag == "term" && <span className="error-message">{errorMessage}</span>}
                  <div className="checkbox-group">

                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        required
                      />
                      <span className="checkmark"></span>
                      <span className="checkbox-label">
                        I agree to the <Link to="/terms" className="auth-link">Terms & Conditions</Link> & <Link to="/privacy" className="auth-link">Privacy Policy</Link>
                      </span>
                    </label>

                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="btn btn-primary auth-submit-btn">
                    Register
                  </button>
                </form>

                {/* Social Separator */}
                <div className="auth-separator">
                  <span>or register with</span>
                </div>

                {/* Social Buttons */}
                <div className="social-buttons-grid">
                  <button className="btn btn-secondary social-btn">
                    <svg viewBox="0 0 24 24" width="18" height="18" className="social-icon">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Google
                  </button>
                  <button className="btn btn-secondary social-btn">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className="social-icon">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.64.74-1.2 1.88-1.05 3 .96.07 2.11-.53 2.8-1.34" />
                    </svg>
                    Apple
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      }
    </>
  );
}




const VerificationField = () => {

}