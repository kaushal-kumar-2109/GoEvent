import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './login_page.css';
import { LOGIN_IN } from '../../../apis/sender';
import { ToastError, ToastInfo, ToastSuccess } from '../../../utils/toast_notification';
import { useEffect } from 'react';

export default function LoginPage({ setIsUserLoggedIn }) {
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("GoEventUserData");
    const data = JSON.parse(raw);
    if (data?.email && data?.role) {
      ToastInfo("User already logged in");
      navigate("/");
    }
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [errorTag, setErrorTag] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorTag(""); setErrorMessage("");

    if (!email) {
      setErrorTag("email"); setErrorMessage("Please enter your email"); return;
    }
    if (!password) {
      setErrorTag("password"); setErrorMessage("Please enter your password"); return;
    }

    setLoading(true);
    const response = await LOGIN_IN({ email, password });
    setLoading(false);

    if (response.success && response.status === 200) {
      ToastSuccess(response.message);
      localStorage.setItem("GoEventUserData", JSON.stringify(response.data));
      setIsUserLoggedIn(true);
      navigate("/");
      return;
    }

    if (response.tag === "email") {
      setErrorTag("email");
      setErrorMessage(response.message);
      ToastError("User not found with this email");
      return;
    }
    if (response.tag === "password") {
      setErrorTag("password");
      setErrorMessage(response.message);
      ToastError(response.message);
      return;
    }
    ToastError(response.message);
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
              <h2>Welcome Back!</h2>
              <h3>Glad to see you again</h3>
              <p>
                Login to your account and explore amazing events, manage your bookings, and much more.
              </p>
            </div>

            {/* Features List */}
            <div className="auth-features">
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                  </svg>
                </div>
                <div className="feature-text">
                  <h4>Discover Events</h4>
                  <p>Find exciting events near you.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-1.99 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2-1.1 0-2-.9-2-2s.9-2 2-2v-4c0-1.1-.9-2-2-2z" />
                  </svg>
                </div>
                <div className="feature-text">
                  <h4>Easy Booking</h4>
                  <p>Book your tickets in just a few clicks.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                  </svg>
                </div>
                <div className="feature-text">
                  <h4>Your Dashboard</h4>
                  <p>Track bookings and manage events.</p>
                </div>
              </div>
            </div>

            <div className="auth-left-footer">
              <p>&copy; {new Date().getFullYear()} GoEvent. All rights reserved.</p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Login Form */}
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
              Don't have an account? <Link to="/register" className="auth-link font-bold">Sign Up</Link>
            </span>
          </div>

          <div className="auth-form-container">
            {/* Top illustration for Mobile view */}
            <div className="mobile-illustration-container">
              <svg viewBox="0 0 200 150" className="mobile-illustration">
                <defs>
                  <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8274E6" />
                    <stop offset="100%" stopColor="#6C5DD3" />
                  </linearGradient>
                  <linearGradient id="glowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#6C5DD3" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#6C5DD3" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Glowing Aura */}
                <circle cx="100" cy="75" r="45" fill="url(#glowGrad)" />
                {/* Modern Phone frame */}
                <rect x="75" y="20" width="50" height="95" rx="8" fill="var(--bg-card)" stroke="var(--border-color)" strokeWidth="3" />
                <rect x="90" y="25" width="20" height="4" rx="2" fill="var(--border-color)" />
                <circle cx="100" cy="108" r="4" fill="var(--border-color)" />
                {/* Inner screen content */}
                <rect x="80" y="34" width="40" height="66" rx="2" fill="var(--bg-tag)" />
                {/* Lock Shield */}
                <rect x="90" y="55" width="20" height="18" rx="3" fill="url(#purpleGrad)" />
                <path d="M93 55V49a7 7 0 0 1 14 0v6" fill="none" stroke="url(#purpleGrad)" strokeWidth="3" />
                <circle cx="100" cy="63" r="2" fill="#FFFFFF" />
                <path d="M100 65v3" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                {/* Checkmarks / Sparkles */}
                <circle cx="140" cy="45" r="8" fill="#00C285" />
                <path d="M137 45l2 2 4-4" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="60" cy="85" r="10" fill="#FFB03A" />
                <path d="M57 85h6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                {/* Decorative dots */}
                <circle cx="145" cy="95" r="3" fill="var(--primary-color)" />
                <circle cx="55" cy="40" r="4" fill="var(--border-color)" />
              </svg>
              <h3>Welcome Back!</h3>
              <p>Login to continue to your account</p>
            </div>

            <div className="auth-form-title">
              <h2>Login to GoEvent</h2>
              <p>Enter your credentials to access your account</p>
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
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {(errorTag === "email") && <p className="error-message">{errorMessage}</p>}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <div className="label-wrapper">
                  <label htmlFor="password">Password</label>
                  <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link>
                </div>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
                {(errorTag === "password") && <p className="error-message">{errorMessage}</p>}
              </div>

              {/* Remember Me Checkbox */}
              <div className="checkbox-group">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-label">Remember me</span>
                </label>
              </div>

              {/* Login Button */}
              <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
                {loading ? <div className="spinner sm" style={{ marginRight: '8px', borderTopColor: '#fff' }}></div> : null}
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Social Separator */}
            <div className="auth-separator">
              <span>or continue with</span>
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

            {/* Disclaimer */}
            <p className="auth-disclaimer">
              By continuing, you agree to our <Link to="/terms" className="auth-link">Terms & Conditions</Link> and <Link to="/privacy" className="auth-link">Privacy Policy</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
