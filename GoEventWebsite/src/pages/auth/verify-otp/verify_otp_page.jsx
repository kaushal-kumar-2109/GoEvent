import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './verify_otp_page.css';
import { SEND_OTP, SIGN_UP } from "../../../apis/sender";
import { ToastError, ToastSuccess } from '../../../utils/toast_notification';

export default function VerifyOtpPage({ userData, setIsDataField, setErrorTag, setErrorMessage, setIsUserLoggedIn }) {

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpErr, setOtpErr] = useState(false);
  const [timer, setTimer] = useState(180);
  const [canResend, setCanResend] = useState(false);
  const [getEmail, setEmail] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();

  // Create refs for each input box
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  const sendOtp = async () => {
    setEmail(userData.email);
    setSendingOtp(true);
    try {
      const response = await SEND_OTP(userData);
      if (response.status !== 200) {
        ToastError(response.message);
        setErrorTag(response.tag);
        setErrorMessage(response.message);
        setIsDataField(false);
        return;
      }
      ToastSuccess(response.message);
    } catch (err) {
      console.error(err);
      ToastError("Failed to send OTP. Please check your network connection.");
    } finally {
      setSendingOtp(false);
    }
  }

  // Send OTP once on component mount
  useEffect(() => {
    sendOtp();
  }, []);

  // Countdown timer logic
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (value, index) => {
    // Only allow numbers
    if (value && isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // Only take the last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        // Clear previous input and focus it
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs[index - 1].current.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (isNaN(pasteData) || pasteData.length !== 6) return;

    const newOtp = pasteData.split('');
    setOtp(newOtp);
    inputRefs[5].current.focus(); // Focus the last box
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtp(['', '', '', '', '', '']);
    setTimer(180);
    setCanResend(false);
    inputRefs[0].current.focus();
    sendOtp();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    userData.otp = otpCode;
    setVerifying(true);
    try {
      const response = await SIGN_UP(userData);
      if (response.status !== 200) {
        if (response.tag === "otp") {
          setOtpErr(response.message);
          return;
        }
        ToastError(response.message);
        setErrorTag(response.tag);
        setErrorMessage(response.message);
        setIsDataField(false);
        return;
      }
      ToastSuccess(response.message);
      localStorage.setItem("GoEventUserData", JSON.stringify(response.data));
      setIsUserLoggedIn(true);
      navigate("/");
    } catch (err) {
      console.error(err);
      ToastError("An error occurred during verification.");
    } finally {
      setVerifying(false);
    }
  };

  if (sendingOtp && timer === 180 && otp.every(d => d === '')) {
    return (
      <div className="auth-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ marginBottom: '16px' }}></div>
          <h3>Sending Verification Code...</h3>
          <p style={{ marginTop: '8px' }}>Please check your inbox at <strong>{userData.email}</strong></p>
        </div>
      </div>
    );
  }

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
              <h2>Verify Your Identity</h2>
              <h3>Just one step away</h3>
              <p>
                To keep your account safe and secure, we've sent a 6-digit security verification code to your email {getEmail} address. Please enter the code to verify your session.
              </p>
            </div>

            {/* Features List */}
            <div className="auth-features">
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                </div>
                <div className="feature-text">
                  <h4>Account Verification</h4>
                  <p>Ensures that only you can access your profile.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z" />
                  </svg>
                </div>
                <div className="feature-text">
                  <h4>Spam Prevention</h4>
                  <p>Protects our community from automated bots.</p>
                </div>
              </div>
            </div>

            <div className="auth-left-footer">
              <p>&copy; {new Date().getFullYear()} GoEvent. All rights reserved.</p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Verify OTP Form */}
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
              Back to <Link to="/login" className="auth-link font-bold">Log In</Link>
            </span>
          </div>

          <div className="auth-form-container">
            {/* Top illustration for Mobile view */}
            <div className="mobile-illustration-container">
              <svg viewBox="0 0 200 130" className="mobile-illustration">
                <defs>
                  <linearGradient id="purpleGradOtp" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8274E6" />
                    <stop offset="100%" stopColor="#6C5DD3" />
                  </linearGradient>
                  <linearGradient id="glowGradOtp" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#6C5DD3" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#6C5DD3" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Glow */}
                <circle cx="100" cy="65" r="40" fill="url(#glowGradOtp)" />
                {/* Shield Outline with Checkmark */}
                <path d="M100 35c20 0 35-10 35-10v35c0 22-15 37-35 43-20-6-35-21-35-43V25s15 10 35 10z" fill="var(--bg-card)" stroke="var(--border-color)" strokeWidth="3" />
                <path d="M90 65l7 7 15-15" fill="none" stroke="url(#purpleGradOtp)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                {/* Sparkles */}
                <path d="M60 40l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="#FFB03A" />
                <path d="M140 85l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="#00C285" />
              </svg>
              <h3>Verification Required</h3>
              <p>Enter the security code sent to you</p>
            </div>

            <div className="auth-form-title">
              <h2>Verify Your Email</h2>
              <p>We've sent a 6-digit verification code to your email. Enter it below to proceed.</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {/* OTP Digits Container */}
              <div className="otp-digits-wrapper">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength="1"
                    ref={inputRefs[idx]}
                    className="otp-digit-input"
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    onPaste={idx === 0 ? handlePaste : undefined}
                    required
                  />
                ))}
              </div>
              {otpErr && <span className="error-message">{otpErr}</span>}

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary auth-submit-btn" disabled={verifying || sendingOtp}>
                {verifying ? <div className="spinner sm" style={{ marginRight: '8px', borderTopColor: '#fff' }}></div> : null}
                {verifying ? 'Verifying...' : 'Verify & Proceed'}
              </button>

              {/* Resend Code Section */}
              <div className="resend-code-section">
                {sendingOtp ? (
                  <p>Sending new code...</p>
                ) : canResend ? (
                  <p>
                    Didn't receive the code?{' '}
                    <button type="button" className="resend-btn" onClick={handleResend} disabled={verifying}>
                      Resend Code
                    </button>
                  </p>
                ) : (
                  <p>
                    Resend code in{' '}
                    <span className="countdown-timer">
                      {timer < 10 ? `0${timer}` : timer}
                    </span> sec
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
