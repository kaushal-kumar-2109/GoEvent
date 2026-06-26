import { useState, useEffect } from 'react';
import Loader from '../../components/loader/loader';
import { useNavigate } from 'react-router-dom';
import { ToastSuccess, ToastError } from '../../assets/toast';
import './setup.css';
import { createUser, sendOtp } from '../../api/postApiHandler/pstData';

export default function Signup() {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    otp: '',
    phone: '',
    password: '',
    organisation: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    otp: '',
    password: '',
    organisation: ''
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    otp: false,
    phone: false,
    password: false,
    organisation: false
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

  // Field validation functions
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'email':
        if (!value) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
      case 'otp':
        if (!value) return 'OTP is required';
        const otpRegex = /^[0-9]{6}$/;
        if (!otpRegex.test(value)) return 'Please enter a valid 6-digit OTP';
        return '';
      case 'phone':
        if (!value) return 'Phone phone is required';
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(value.replace(/[\s-()]/g, ''))) return 'Please enter a valid 10-digit phone phone';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        return '';
      case 'organisation':
        if (!value.trim()) return 'Organisation name is required';
        return '';
      default:
        return '';
    }
  };

  // Change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // Blur handler
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Send OTP handler
  const handleSendOtp = async () => {
    const emailError = validateField('email', formData.email);
    if (emailError) {
      setTouched((prev) => ({ ...prev, email: true }));
      setErrors((prev) => ({ ...prev, email: emailError }));
      ToastError(emailError);
      return;
    }
    setIsSendingOtp(true);
    const response = await sendOtp({ email: formData.email, tag: "signup" });
    if (response.flag) {
      setIsOtpSent(true);
      ToastSuccess(response.data.message);
    } else {
      ToastError(response.data.message);
    }

    setIsSendingOtp(false);
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    let hasError = false;

    Object.keys(formData).forEach((key) => {
      if (key === 'otp' && !isOtpSent) {
        newErrors["email"] = 'Please verify your email first';
        hasError = true;
        ToastError("verify your email!");
        return;
      }
      const error = validateField(key, formData[key]);
      newErrors[key] = error;
      if (error) hasError = true;
    });
    setTouched({
      name: true,
      email: true,
      otp: true,
      phone: true,
      password: true,
      organisation: true
    });
    setErrors(newErrors);

    if (!hasError) {
      setIsSubmitting(true);
      const response = await createUser({
        name: formData.name,
        email: formData.email,
        otp: formData.otp,
        phone: formData.phone,
        password: formData.password,
        organisation: formData.organisation
      });
      if (response.flag) {
        ToastSuccess(response.data.message);
        localStorage.setItem("GoEventUserData",
          JSON.stringify({
            token: response.data.token,
            name: formData.name,
            email: formData.email,
            validTill: Date.now() + 7 * 24 * 60 * 60 * 1000
          })
        );
        navigate("/GoEvent");
        return;
      } else {
        newErrors[response.data.tag] = response.data.message;
        hasError = true;
        ToastError(response.data.message);
      }
      setIsSubmitting(false);
    }
  };

  const isFormValid = !Object.values(errors).some((err) => err) &&
    Object.values(touched).some((t) => t);

  if (isLoading) {
    return <Loader text="Loading Signup" />;
  }

  return (
    <div className="setup-page-wrapper">
      <div className="setup-card" style={{ maxWidth: '520px' }}>
        <div className="setup-header">
          <div className="setup-logo">GoEvent</div>
          <h2 className="setup-title">Create Account</h2>
          <p className="setup-subtitle">Sign up to start organizing and managing your events</p>
        </div>

        <form className="setup-form" onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="setup-form-group">
            <label className="setup-label" htmlFor="signup-name">Full Name</label>
            <div className="setup-input-wrapper">
              <input
                id="signup-name"
                type="text"
                name="name"
                className={`setup-input ${touched.name && errors.name ? 'input-error' : ''}`}
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                required
              />
              <span className="setup-input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
            </div>
            {touched.name && errors.name && (
              <span className="setup-error-text" id="name-error">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
                {errors.name}
              </span>
            )}
          </div>

          {/* Email Address */}
          <div className="setup-form-group">
            <label className="setup-label" htmlFor="signup-email">Email Address</label>
            <div className="setup-input-wrapper">
              <input
                id="signup-email"
                type="email"
                name="email"
                className={`setup-input setup-input-email ${touched.email && errors.email ? 'input-error' : ''}`}
                placeholder="john@company.com"
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

          {/* otp verification */}
          {isOtpSent && (
            <div className="setup-form-group">
              <label className="setup-label" htmlFor="signup-otp">OTP Verification</label>
              <div className="setup-input-wrapper">
                <input
                  id="signup-otp"
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

          {/* Phone phone */}
          <div className="setup-form-group">
            <label className="setup-label" htmlFor="signup-phone">Phone phone</label>
            <div className="setup-input-wrapper">
              <input
                id="signup-phone"
                type="tel"
                name="phone"
                className={`setup-input ${touched.phone && errors.phone ? 'input-error' : ''}`}
                placeholder="10-digit phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                required
              />
              <span className="setup-input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
            </div>
            {touched.phone && errors.phone && (
              <span className="setup-error-text" id="phone-error">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
                {errors.phone}
              </span>
            )}
          </div>

          {/* Organisation */}
          <div className="setup-form-group">
            <label className="setup-label" htmlFor="signup-organisation">Organisation</label>
            <div className="setup-input-wrapper">
              <input
                id="signup-organisation"
                type="text"
                name="organisation"
                className={`setup-input ${touched.organisation && errors.organisation ? 'input-error' : ''}`}
                placeholder="Acme Corp"
                value={formData.organisation}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                required
              />
              <span className="setup-input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </span>
            </div>
            {touched.organisation && errors.organisation && (
              <span className="setup-error-text" id="organisation-error">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
                {errors.organisation}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="setup-form-group">
            <label className="setup-label" htmlFor="signup-password">Password</label>
            <div className="setup-input-wrapper">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={`setup-input setup-input-password ${touched.password && errors.password ? 'input-error' : ''}`}
                placeholder="Min 8 characters"
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
            disabled={isSubmitting || (isFormValid && Object.values(errors).some(e => e))}
          >
            {isSubmitting ? (
              <>
                <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" strokeDasharray="40 20" />
                </svg>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="setup-footer">
          Already have an account?{' '}
          <a href="/GoEvent/login" className="setup-link">
            Sign In
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
