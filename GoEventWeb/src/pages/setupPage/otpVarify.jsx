import React, { useState, useRef, useEffect } from 'react';
import Loader from '../../components/loader/loader';
import './setup.css';

export default function OtpVerify() {
  const [isLoading, setIsLoading] = useState(true);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);

  // References for all 6 input boxes
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Countdown timer logic
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Handle OTP digit changes
  const handleChange = (index, value) => {
    // Only accept numeric inputs
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Take only the last character (in case user inputs multiple in one field)
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setError('');

    // If input is filled, focus the next input
    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  // Handle backspace/key down events
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      
      // If current input is empty, clear the previous input and focus it
      if (!otp[index] && index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs[index - 1].current.focus();
      } else {
        // Just clear the current input
        newOtp[index] = '';
        setOtp(newOtp);
      }
      setError('');
    }
  };

  // Handle paste events
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Check if pasted value is numeric and length matches
    if (!/^\d+$/.test(pastedData)) return;
    
    const pastedDigits = pastedData.split('').slice(0, 6);
    const newOtp = [...otp];
    
    pastedDigits.forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char;
      }
    });
    
    setOtp(newOtp);
    setError('');

    // Focus last filled index or final index
    const focusIndex = Math.min(pastedDigits.length, 5);
    inputRefs[focusIndex].current.focus();
  };

  // Resend OTP action
  const handleResend = () => {
    if (!canResend) return;
    
    setTimer(59);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    setError('');
    inputRefs[0].current.focus();
    console.log('OTP Resend requested.');
    alert('A new 6-digit OTP code has been sent to your email.');
  };

  // Submit/Verification handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length < 6) {
      setError('Please enter all 6 digits of the OTP');
      return;
    }

    setIsSubmitting(true);
    console.log('Verifying OTP code:', otpCode);
    
    // Simulating API verification loading state.
    setTimeout(() => {
      setIsSubmitting(false);
      // For demo verification, assume '123456' is the correct OTP or accept any code
      if (otpCode === '000000') {
        setError('Invalid OTP code. Please try again.');
      } else {
        alert('OTP Verification Successful!');
      }
    }, 1500);
  };

  const isOtpComplete = otp.every((val) => val !== '');

  if (isLoading) {
    return <Loader text="Loading OTP Verification" />;
  }

  return (
    <div className="setup-page-wrapper">
      <div className="setup-card">
        <div className="setup-header">
          <div className="setup-logo">GoEvent</div>
          <h2 className="setup-title">Verify OTP</h2>
          <p className="setup-subtitle">
            We've sent a 6-digit verification code to your email. Enter it below to proceed.
          </p>
        </div>

        <form className="setup-form" onSubmit={handleSubmit} noValidate>
          <div className="setup-form-group">
            <label className="setup-label">Verification Code</label>
            <div className="otp-input-container" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="1"
                  ref={inputRefs[index]}
                  className={`otp-box ${error ? 'input-error' : ''}`}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={isSubmitting}
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>
            {error && (
              <span className="setup-error-text" id="otp-error">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
                {error}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="setup-btn setup-btn-primary"
            disabled={isSubmitting || !isOtpComplete}
          >
            {isSubmitting ? (
              <>
                <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" strokeDasharray="40 20" />
                </svg>
                Verifying...
              </>
            ) : (
              'Verify OTP'
            )}
          </button>
        </form>

        {/* Resend Code Section */}
        <div className="otp-resend-container">
          {canResend ? (
            <span>
              Didn't receive the code?{' '}
              <button type="button" className="setup-link" onClick={handleResend}>
                Resend Code
              </button>
            </span>
          ) : (
            <span>
              Resend code in <span className="otp-timer">0:{timer < 10 ? `0${timer}` : timer}</span>
            </span>
          )}
        </div>

        <div className="setup-footer">
          Back to{' '}
          <a href="/login" className="setup-link" onClick={(e) => { e.preventDefault(); alert('Redirecting to Log In...'); }}>
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
