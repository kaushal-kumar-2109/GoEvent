import { useState, useEffect } from 'react';
import Loader from '../../components/loader/loader';
import { useNavigate } from 'react-router-dom';
import { ToastSuccess, ToastError } from '../../assets/toast';
import { sendOtp, setUser } from '../../api/postApiHandler/pstData';
import './setup.css';

export default function Login() {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    otp: ''
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
    otp: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Email validation helper
  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  // Password validation helper
  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    return '';
  };

  // OTP validation helper
  const validateOtp = (otp) => {
    if (!otp) return 'OTP is required';
    const otpRegex = /^[0-9]{6}$/;
    if (!otpRegex.test(otp)) return 'Please enter a valid 6-digit OTP';
    return '';
  };

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      let error = '';
      if (name === 'email') error = validateEmail(value);
      if (name === 'password') error = validatePassword(value);
      if (name === 'otp') error = validateOtp(value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // Blur handler to validate on focus loss
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    let error = '';
    if (name === 'email') error = validateEmail(value);
    if (name === 'password') error = validatePassword(value);
    if (name === 'otp') error = validateOtp(value);

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Send OTP handler
  const handleSendOtp = async () => {
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setTouched((prev) => ({ ...prev, email: true }));
      setErrors((prev) => ({ ...prev, email: emailError }));
      ToastError(emailError);
      return;
    }

    setIsSendingOtp(true);
    const response = await sendOtp({ email: formData.email, tag: "login" });
    if (response.flag) {
      setIsOtpSent(true);
      ToastSuccess(response.data.message);
    } else {
      ToastError(response.data.message);
    }
    setIsSendingOtp(false);
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailErr = validateEmail(formData.email);
    const passErr = validatePassword(formData.password);
    const otpErr = isOtpSent ? validateOtp(formData.otp) : 'Please verify your email first';

    setTouched({ email: true, password: true, otp: true });
    setErrors({ email: emailErr, password: passErr, otp: otpErr });

    if (!emailErr && !passErr && !otpErr) {
      setIsSubmitting(true);
      const response = await setUser({
        email: formData.email,
        password: formData.password,
        otp: formData.otp
      });
      if (response.flag) {
        ToastSuccess(response.data.message);
        localStorage.setItem("GoEventUserData",
          JSON.stringify({
            token: response.data.token,
            name: response.data.name,
            email: response.data.email,
            validTill: Date.now() + 7 * 24 * 60 * 60 * 1000
          })
        );
        navigate("/GoEvent");
        return;
      } else {
        ToastError(response.data.message);
      }
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loader text="Loading Login" />;
  }

  return (
    <div className="setup-page-wrapper">
      <div className="setup-card">
        <div className="setup-header">
          <div className="setup-logo">GoEvent</div>
          <h2 className="setup-title">Welcome Back</h2>
          <p className="setup-subtitle">Sign in to manage your events and registrations</p>
        </div>

        <form className="setup-form" onSubmit={handleSubmit} noValidate>
          {/* Email Field */}
          <div className="setup-form-group">
            <label className="setup-label" htmlFor="login-email">Email Address</label>
            <div className="setup-input-wrapper">
              <input
                id="login-email"
                type="email"
                name="email"
                className={`setup-input setup-input-email ${touched.email && errors.email ? 'input-error' : ''}`}
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting || isOtpSent}
                required
              />
              <button
                type="button"
                className="setup-input-button"
                onClick={handleSendOtp}
                disabled={isSendingOtp || isOtpSent}
              >
                {isSendingOtp ? 'Sending...' : isOtpSent ? 'Sent' : 'Verify'}
              </button>
              <span className="setup-input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </span>
            </div>
            {touched.email && errors.email && (
              <span className="setup-error-text" id="email-error">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
                {errors.email}
              </span>
            )}
          </div>

          {/* OTP Verification Field */}
          {isOtpSent && (
            <div className="setup-form-group">
              <label className="setup-label" htmlFor="login-otp">OTP Verification</label>
              <div className="setup-input-wrapper">
                <input
                  id="login-otp"
                  type="text"
                  name="otp"
                  className={`setup-input ${touched.otp && errors.otp ? 'input-error' : ''}`}
                  placeholder="123456"
                  value={formData.otp}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  required
                />
                <span className="setup-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
              </div>
              {touched.otp && errors.otp && (
                <span className="setup-error-text" id="otp-error">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" x2="12" y1="8" y2="12" />
                    <line x1="12" x2="12.01" y1="16" y2="16" />
                  </svg>
                  {errors.otp}
                </span>
              )}
            </div>
          )}

          {/* Password Field */}
          <div className="setup-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="setup-label" htmlFor="login-password">Password</label>
              <div className="setup-form-options">
                <a href="/GoEvent/forgot" className="setup-link">
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="setup-input-wrapper">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={`setup-input setup-input-password ${touched.password && errors.password ? 'input-error' : ''}`}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                required
              />
              <span className="setup-input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <button
                type="button"
                className="setup-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" x2="22" y1="2" y2="22" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {touched.password && errors.password && (
              <span className="setup-error-text" id="password-error">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
                {errors.password}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="setup-btn setup-btn-primary"
            disabled={isSubmitting || (touched.email && errors.email) || (touched.password && errors.password)}
          >
            {isSubmitting ? (
              <>
                <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" strokeDasharray="40 20" />
                </svg>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="setup-footer">
          Don't have an account?{' '}
          <a href="/GoEvent/signup" className="setup-link" >
            Sign up now
          </a>
        </div>
      </div>

      {/* Inline styles for spinner rotation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
