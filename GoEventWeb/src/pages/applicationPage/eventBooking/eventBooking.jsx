import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import NavBar from '../../../components/navBar/navBar';
import SideBar from '../../../components/sideBar/sideBar';
import Footer from '../../../components/footer/footer';
import Loader from '../../../components/loader/loader';
import { getEventById, getUserProfile } from '../../../api/getApiHandler/getData';
import { bookEvent } from '../../../api/postApiHandler/pstData';
import { ToastSuccess, ToastError, ToastWarning } from '../../../assets/toast.jsx';
import { CheckUserAuth } from '../../../middleware/chekUserAuth.jsx';
import './eventBooking.css';

export default function EventBooking({ isUserLoggedIn, setIsUserLoggedIn }) {
  const { uid, eid } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [userData, setUserData] = useState(null);

  // Booking Form State
  const [seats, setSeats] = useState(1);
  const [attenders, setAttenders] = useState([
    { name: '', email: '', age: '' }
  ]);
  const [transectionName, setTransectionName] = useState('');
  const [transectionId, setTransectionId] = useState('');

  const CheckAuth = async () => {
    const isUserValid = await CheckUserAuth();
    if (!isUserValid) {
      navigate("/GoEvent/login");
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load Event
      const eventRes = await getEventById(eid);
      if (eventRes && eventRes.flag && eventRes.data && eventRes.data.data) {
        setEventData(eventRes.data.data);
      } else {
        ToastError("Failed to fetch event data.");
        navigate('/GoEvent');
        return;
      }

      // Load User Profile to pre-fill first attender
      const userRes = await getUserProfile();
      if (userRes && userRes.flag && userRes.data && userRes.data.userData) {
        const uData = userRes.data.userData;
        setUserData(uData);
        // Pre-fill first attender
        setAttenders([{
          name: uData.name || '',
          email: uData.email || '',
          age: ''
        }]);
      }
    } catch (err) {
      console.error("Error loading booking details: ", err);
      ToastError("An error occurred while loading details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    CheckAuth();
    loadData();
  }, [eid]);

  // Handle number of seats changing
  const handleSeatsChange = (newSeats) => {
    const count = Math.max(1, Math.min(newSeats, eventData?.availableSeats || 10, 10));
    setSeats(count);

    // Adjust attenders array length
    setAttenders(prev => {
      const updated = [...prev];
      if (count > updated.length) {
        // Add more attender forms
        for (let i = updated.length; i < count; i++) {
          updated.push({ name: '', email: '', age: '' });
        }
      } else if (count < updated.length) {
        // Remove excess forms
        updated.splice(count);
      }
      return updated;
    });
  };

  const handleAttenderChange = (index, field, value) => {
    setAttenders(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventData) return;

    // Validate Attenders
    for (let i = 0; i < attenders.length; i++) {
      const a = attenders[i];
      if (!a.name.trim()) {
        ToastWarning(`Please enter Name for Attendee #${i + 1}`);
        return;
      }
      if (!a.email.trim()) {
        ToastWarning(`Please enter Email for Attendee #${i + 1}`);
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email)) {
        ToastWarning(`Please enter a valid Email for Attendee #${i + 1}`);
        return;
      }
      if (!a.age || isNaN(a.age) || parseInt(a.age) <= 0) {
        ToastWarning(`Please enter a valid Age for Attendee #${i + 1}`);
        return;
      }
    }

    // Validate Payment details if paid event
    const isPaid = eventData.ticketPrice > 0;
    if (isPaid) {
      if (!transectionName.trim()) {
        ToastWarning("Transaction Name (Payment Method) is required.");
        return;
      }
      if (!transectionId.trim()) {
        ToastWarning("Transaction ID (Reference ID) is required.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Map to exact model properties expected by Backend Schema
      const payload = {
        eventId: eid,
        userId: uid,
        seats: seats,
        attenders: attenders.map((a, i) => ({
          ticketId: `TKT-${Math.floor(10000000 + Math.random() * 90000000)}-${i + 1}`,
          name: a.name.trim(),
          email: a.email.trim(),
          age: parseInt(a.age)
        })),
        transectionName: isPaid ? transectionName.trim() : "FREE",
        transectionId: isPaid ? transectionId.trim() : "FREE"
      };

      const res = await bookEvent(payload);
      if (res && res.flag) {
        ToastSuccess("Ticket booked successfully!");
        setTimeout(() => {
          navigate(`/GoEvent/event/${eid}`);
        }, 1500);
      } else {
        ToastError(res?.data?.message || "Failed to book tickets. Please try again.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      ToastError("An error occurred during booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loader text="Preparing Booking Page..." />;
  }

  if (!eventData) {
    return (
      <div className="event-booking-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <h2>Event Details Load Error</h2>
        <p style={{ color: '#94a3b8', margin: '1rem 0' }}>Could not load the details of the event you wish to book.</p>
        <Link to="/GoEvent" className="btn-explore">Back to Home</Link>
      </div>
    );
  }

  const { title, bannerImage, category, ticketPrice, eventMode, venueName, address, city, state, country, availableSeats } = eventData;
  const isPaid = ticketPrice > 0;
  const totalPrice = seats * ticketPrice;

  return (
    <div className="event-booking-wrapper">
      <NavBar
        isUserLoggedIn={isUserLoggedIn}
        setIsUserLoggedIn={setIsUserLoggedIn}
        onToggleSidebar={() => setSidebarOpen(true)}
        tag={"none"}
      />

      <SideBar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isUserLoggedIn={isUserLoggedIn}
        setIsUserLoggedIn={setIsUserLoggedIn}
        tag={"none"}
      />

      <div className="booking-container">
        {/* Left Side: Summary Card */}
        <aside className="booking-summary-aside">
          <div className="summary-card">
            <div className="summary-banner" style={{ backgroundImage: `url('${bannerImage}')` }}>
              <div className="summary-overlay"></div>
              <span className="summary-category">{category || "General"}</span>
            </div>
            <div className="summary-content">
              <h2 className="summary-title">{title}</h2>
              <div className="summary-meta-row">
                <span className="summary-mode-badge">{eventMode}</span>
                <span className="summary-price-badge">{isPaid ? `₹${ticketPrice} / ticket` : "Free Event"}</span>
              </div>

              <div className="summary-details">
                {eventMode === "offline" ? (
                  <div className="detail-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{venueName}, {city}, {state}</span>
                  </div>
                ) : (
                  <div className="detail-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="23 7 16 12 23 17 23 7" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                    <span>Online Access provided on Event Date</span>
                  </div>
                )}
                <div className="detail-item text-warning">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>{new Date(eventData.startDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                </div>
              </div>

              <div className="total-calculation-box">
                <div className="calc-row">
                  <span>Price per ticket</span>
                  <span>{isPaid ? `₹${ticketPrice}` : "₹0"}</span>
                </div>
                <div className="calc-row">
                  <span>Number of seats</span>
                  <span>x {seats}</span>
                </div>
                <div className="calc-divider"></div>
                <div className="calc-row total">
                  <span>Total Amount</span>
                  <span>{isPaid ? `₹${totalPrice}` : "Free"}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Side: Booking Form */}
        <main className="booking-form-main">
          <form className="booking-form-card" onSubmit={handleSubmit}>
            <div className="form-header">
              <h1>Book Your Tickets</h1>
              <p>Secure your spot by filling out attendee details.</p>
            </div>

            {/* Seat Count Selection */}
            <div className="form-section">
              <label className="section-label">Select Number of Tickets</label>
              <div className="seats-selection-row">
                <div className="seats-input-wrapper">
                  <button
                    type="button"
                    className="btn-seat-adjust"
                    onClick={() => handleSeatsChange(seats - 1)}
                    disabled={seats <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="seats-number-input"
                    value={seats}
                    onChange={(e) => handleSeatsChange(parseInt(e.target.value) || 1)}
                    min="1"
                    max={Math.min(availableSeats || 10, 10)}
                    readOnly
                  />
                  <button
                    type="button"
                    className="btn-seat-adjust"
                    onClick={() => handleSeatsChange(seats + 1)}
                    disabled={seats >= Math.min(availableSeats || 10, 10)}
                  >
                    +
                  </button>
                </div>
                <span className="seats-helper-text">
                  (Max 10 per booking. {availableSeats || 0} seats left)
                </span>
              </div>
            </div>

            {/* Attendee details forms */}
            <div className="form-section">
              <h3 className="section-label">Attendee Details</h3>
              <div className="attenders-list">
                {attenders.map((attender, index) => (
                  <div key={index} className="attender-form-block">
                    <div className="attender-header">
                      <h4>Attendee #{index + 1} {index === 0 && <span className="primary-badge">(You)</span>}</h4>
                    </div>
                    <div className="attender-grid">
                      <div className="input-group">
                        <label>Full Name</label>
                        <input
                          type="text"
                          placeholder="Enter name"
                          value={attender.name}
                          onChange={(e) => handleAttenderChange(index, 'name', e.target.value)}
                          required
                        />
                      </div>
                      <div className="input-group">
                        <label>Email Address</label>
                        <input
                          type="email"
                          placeholder="Enter email"
                          value={attender.email}
                          onChange={(e) => handleAttenderChange(index, 'email', e.target.value)}
                          required
                        />
                      </div>
                      <div className="input-group age-group">
                        <label>Age</label>
                        <input
                          type="number"
                          placeholder="Age"
                          value={attender.age}
                          onChange={(e) => handleAttenderChange(index, 'age', e.target.value)}
                          min="1"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Section */}
            {(isPaid) ? (
              <div className="form-section payment-section">
                <h3 className="section-label">Payment Information</h3>
                <p className="payment-intro-text">
                  Please scan the QR code or send payment to the UPI address listed below, then enter the payment receipt reference details.
                </p>

                <div className="payment-gateway-box">
                  {eventData.paymentQr && eventData.paymentQr !== "null" && (
                    <div className="payment-qr-wrapper">
                      <img src={eventData.paymentQr} alt="Payment QR Code" className="payment-qr-img" />
                      <span className="qr-caption">Scan QR to Pay</span>
                    </div>
                  )}

                  <div className="payment-text-details">
                    <div className="payment-field">
                      <span className="label">UPI Address:</span>
                      <span className="value copyable">{eventData.paymentUPI}</span>
                    </div>
                    <div className="payment-field">
                      <span className="label">Account Holder:</span>
                      <span className="value">{eventData.paymentUPTName}</span>
                    </div>
                    <div className="payment-field total-due">
                      <span className="label">Total Price Due:</span>
                      <span className="value text-accent">₹{totalPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="payment-input-row">
                  <div className="input-group">
                    <label>Transaction / App Name</label>
                    <input
                      type="text"
                      placeholder="e.g. GPay, PhonePe, Paytm"
                      value={transectionName}
                      onChange={(e) => setTransectionName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>Transaction ID / UPI Ref No.</label>
                    <input
                      type="text"
                      placeholder="e.g. 348910328904"
                      value={transectionId}
                      onChange={(e) => setTransectionId(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="form-section free-event-info">
                <div className="free-badge-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h4>Free Registration</h4>
                  <p>This event is free of charge. No payment details are required, simply confirm your booking!</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="form-actions">
              <button
                type="submit"
                className="btn-booking-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing Booking..." : `Confirm & Book (${seats} Tickets)`}
              </button>
              <Link to={`/GoEvent/event/${eid}`} className="btn-booking-cancel">
                Cancel
              </Link>
            </div>
          </form>
        </main>
      </div>
      <Footer />
    </div>
  );
}