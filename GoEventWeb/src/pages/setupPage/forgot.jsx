import React, { useState, useEffect } from 'react';
import Loader from '../../components/loader/loader';
import ROUTERS from '../../api/connect.api';
import { ToastSuccess, ToastError } from '../../assets/toast';
import './setup.css';

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpTouched, setOtpTouched] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Email validation helper
  const validateEmail = (val) => {
    if (!val) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) return 'Please enter a valid email address';
    return '';
  };

  // OTP validation helper
  const validateOtp = (val) => {
    if (!val) return 'OTP is required';
    const otpRegex = /^[0-9]{6}$/;
    if (!otpRegex.test(val)) return 'Please enter a valid 6-digit OTP';
    return '';
  };

  // Change handler
  const handleChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (touched) {
      setError(validateEmail(val));
    }
  };

  // Blur handler
  const handleBlur = () => {
    setTouched(true);
    setError(validateEmail(email));
  };

  const handleOtpChange = (e) => {
    const val = e.target.value;
    setOtp(val);
    if (otpTouched) {
      setOtpError(validateOtp(val));
    }
  };

  const handleOtpBlur = () => {
    setOtpTouched(true);
    setOtpError(validateOtp(otp));
  };

  // Send OTP handler
  const handleSendOtp = async () => {
    const emailError = validateEmail(email);
    if (emailError) {
      setTouched(true);
      setError(emailError);
      ToastError(emailError);
      return;
    }

    setIsSendingOtp(true);
    try {
      const response = await fetch(ROUTERS.POST_ROUTE.sendOtp, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, tag: 'login' }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setIsOtpSent(true);
        ToastSuccess('OTP sent successfully to your email!');
      } else {
        ToastError(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      console.error(err);
      ToastError('Network error. Failed to send OTP.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    setOtpTouched(true);
    const err = validateEmail(email);
    setError(err);
    const otpErr = isOtpSent ? validateOtp(otp) : 'Please verify your email first';
    setOtpError(otpErr);

    if (!err && !otpErr) {
      setIsSubmitting(true);
      console.log('Forgot Password requested for:', email);
      // Simulating API loading state.
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
      }, 1500);
    }
  };

  if (isLoading) {
    return <Loader text="Loading Forgot Password" />;
  }

  return (
    <div className="setup-page-wrapper">
      <div className="setup-card">
        <div className="setup-header">
          <div className="setup-logo">GoEvent</div>
          <h2 className="setup-title">Forgot Password?</h2>
          <p className="setup-subtitle">
            {isSuccess
              ? "We've sent a password reset link to your email."
              : "Enter your email address and we'll send you a link to reset your password."}
          </p>
        </div>

        {isSuccess ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '4rem',
              height: '4rem',
              borderRadius: '50%',
              background: 'rgba(52, 211, 153, 0.1)',
              color: 'var(--success-color)',
              marginBottom: '1.5rem'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: '2rem', lineHeight: '1.6' }}>
              Please check your inbox at <strong style={{ color: 'var(--text-primary)' }}>{email}</strong> for instructions on resetting your password.
            </p>
            <button
              type="button"
              className="setup-btn setup-btn-primary"
              onClick={() => { setIsSuccess(false); setEmail(''); setTouched(false); }}
            >
              Resend Link
            </button>
          </div>
        ) : (
          <form className="setup-form" onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <div className="setup-form-group">
              <label className="setup-label" htmlFor="forgot-email">Email Address</label>
              <div className="setup-input-wrapper">
                <input
                  id="forgot-email"
                  type="email"
                  className={`setup-input setup-input-email ${touched && error ? 'input-error' : ''}`}
                  placeholder="name@company.com"
                  value={email}
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
              {touched && error && (
                <span className="setup-error-text" id="email-error">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" x2="12" y1="8" y2="12" />
                    <line x1="12" x2="12.01" y1="16" y2="16" />
                  </svg>
                  {error}
                </span>
              )}
            </div>

            {/* OTP Verification Field */}
            {isOtpSent && (
              <div className="setup-form-group">
                <label className="setup-label" htmlFor="forgot-otp">OTP Verification</label>
                <div className="setup-input-wrapper">
                  <input
                    id="forgot-otp"
                    type="text"
                    className={`setup-input ${otpTouched && otpError ? 'input-error' : ''}`}
                    placeholder="123456"
                    value={otp}
                    onChange={handleOtpChange}
                    onBlur={handleOtpBlur}
                    disabled={isSubmitting}
                    required
                  />
                  <span className="setup-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span >
                </div>
                {otpTouched && otpError && (
                  <span className="setup-error-text" id="otp-error">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" x2="12" y1="8" y2="12" />
                      <line x1="12" x2="12.01" y1="16" y2="16" />
                    </svg>
                    {otpError}
                  </span>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="setup-btn setup-btn-primary"
              disabled={isSubmitting || (touched && error) || (otpTouched && otpError)}
            >
              {isSubmitting ? (
                <>
                  <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" strokeDasharray="40 20" />
                  </svg>
                  Sending Link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        )}

        <div className="setup-footer">
          Back to{' '}
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
