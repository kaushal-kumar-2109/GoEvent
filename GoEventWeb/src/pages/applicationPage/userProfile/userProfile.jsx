import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../../components/navBar/navBar';
import SideBar from '../../../components/sideBar/sideBar';
import Footer from '../../../components/footer/footer';
import Loader from '../../../components/loader/loader';
import { sendOtp, updateUserPassword } from '../../../api/postApiHandler/pstData';
import { ToastSuccess, ToastError, ToastWarning, ToastInfo } from '../../../assets/toast';
import { CheckUserAuth } from '../../../middleware/chekUserAuth';
import './userProfile.css';
import { getUserProfile } from '../../../api/getApiHandler/getData';

// Pre-defined avatars to choose from
const AVATAR_OPTIONS = [
  '/avatar/user1.jpg', '/avatar/user2.jpg', '/avatar/user3.jpg', '/avatar/user4.jpg',
  '/avatar/user5.jpg', '/avatar/user6.jpg', '/avatar/user7.jpg', '/avatar/user8.jpg',
  '/avatar/user9.jpg', '/avatar/user10.jpg', '/avatar/user11.jpg', '/avatar/user12.jpg',
  '/avatar/user13.png', '/avatar/user14.png', '/avatar/user15.png', '/avatar/user16.png',
];

export default function UserProfile({ isUserLoggedIn, setIsUserLoggedIn }) {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // profile | bookings | hosted | security | notifications
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  // Profile data synchronized with local storage
  const [profileData, setProfileData] = useState({
    name: 'User',
    email: 'email@domain.com',
    phone: '9988776655',
    organisation: 'GoEvent Studio',
    bio: 'Avid event planner and technology enthusiast. Passionate about bringing communities together.',
    avatar: AVATAR_OPTIONS[0]
  });
  // Notification states
  const [notifications, setNotifications] = useState({
    bookingConfirm: true,
    weeklyDigest: false,
    newsletters: true,
    securityAlerts: true
  });
  // Mock Booked Tickets
  const [ticketsList, setTicketsList] = useState([]);
  // Mock Hosted Events
  const [hostedEvents, setHostedEvents] = useState([]);
  const [hostedFilter, setHostedFilter] = useState('all');

  const GetUserData = async () => {

    const response = await getUserProfile();
    ToastSuccess(response.data.message);

    if (!response.flag) return;

    const data = {
      userData: response.data.userData,
      createdEvents: response.data.createdEvents,
      bookedEvents: response.data.bookedEvents,
      notificationsSettings: notifications,
    };
    console.log(data);
    setProfileData((prev) => ({
      ...prev,
      name: data.userData.name,
      email: data.userData.email,
      phone: data.userData.phone,
      avatar: data.userData.avatar || AVATAR_OPTIONS[0],
      bio: data.userData.bio || 'Avid event planner and technology enthusiast. Passionate about bringing communities together.',
      organisation: data.userData.organisation,
      _id: data.userData._id
    }));
    setNotifications(() => (prev) => ({ ...prev, ...data.notificationsSettings }));
    setHostedEvents(data.createdEvents);
    setTicketsList(data.bookedEvents);
  };

  // Load user data on mount
  useEffect(() => {
    setIsLoading(true);
    const isAuthed = CheckUserAuth();
    if (!isAuthed) {
      ToastWarning("Please log in to view your profile dashboard.");
      navigate('/GoEvent/login');
      return;
    }
    GetUserData();
    setIsLoading(false);
  }, [navigate]);

  // Save profile changes (saves back to localStorage active session)
  const saveProfile = (e) => {
    e.preventDefault();
  };





































  // Selected ticket for modal details
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketToCancel, setTicketToCancel] = useState(null);

  // Security Form
  const [securityData, setSecurityData] = useState({
    newPassword: '',
    confirmPassword: '',
    otp: ''
  });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Mock Active sessions
  const [sessions, setSessions] = useState([
    { id: 1, device: "Windows Desktop", browser: "Chrome", location: "Mumbai, India", current: true },
    { id: 2, device: "Apple iPhone 14", browser: "Safari", location: "Pune, India", current: false }
  ]);

  // Handle inputs for profile form
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // Revoke session handler
  const revokeSession = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    ToastSuccess("Session terminated successfully.");
  };

  // Change avatar handler
  const selectAvatar = (url) => {
    setProfileData((prev) => ({ ...prev, avatar: url }));
    setShowAvatarModal(false);
  };

  // Cancel booking warning triggers
  const triggerCancelBooking = (ticket, e) => {
    e.stopPropagation(); // Stop opening ticket details
    setTicketToCancel(ticket);
  };

  // Confirmed cancel booking
  const confirmCancelBooking = () => {
    if (!ticketToCancel) return;

    setTicketsList((prev) =>
      prev.map((t) => (t.id === ticketToCancel.id ? { ...t, status: "cancelled" } : t))
    );

    ToastSuccess(`Booking reservation ${ticketToCancel.id} has been cancelled.`);
    setTicketToCancel(null);
    setSelectedTicket(null); // Close modal if it was open
  };

  // Trigger OTP for change password
  const handleRequestOtp = async () => {
    setOtpLoading(true);
    try {
      const res = await sendOtp({ email: profileData.email, tag: "login" });
      if (res.flag) {
        ToastSuccess("OTP sent successfully. Please check your email inbox.");
        setIsOtpSent(true);
      } else {
        ToastError(res.message || "Failed to dispatch verification OTP.");
      }
    } catch (err) {
      ToastError("Network error requesting OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Confirm password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      ToastWarning("Passwords do not match.");
      return;
    }
    if (securityData.newPassword.length < 8) {
      ToastWarning("Password must be at least 8 characters long.");
      return;
    }
    if (!securityData.otp.trim()) {
      ToastWarning("Please enter verification OTP.");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await updateUserPassword({
        email: profileData.email,
        password: securityData.newPassword,
        otp: securityData.otp
      });

      if (res.flag) {
        ToastSuccess("Account security password updated successfully.");
        setSecurityData({ newPassword: '', confirmPassword: '', otp: '' });
        setIsOtpSent(false);
      } else {
        ToastError(res.data?.message || res.message || "Failed to update password.");
      }
    } catch (err) {
      ToastError("Failed to communicate with password reset servers.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="profile-wrapper">
      {/* Navigation */}
      <NavBar
        isUserLoggedIn={isUserLoggedIn}
        setIsUserLoggedIn={setIsUserLoggedIn}
        onToggleSidebar={() => setSidebarOpen(true)}
        tag="profile"
      />

      <SideBar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isUserLoggedIn={isUserLoggedIn}
        setIsUserLoggedIn={setIsUserLoggedIn}
        tag="profile"
      />

      {isLoading && <Loader text="Updating account configuration..." />}

      {/* Main dashboard content */}
      <main className="profile-main">
        {/* Profile Header Banner Section */}
        <div className="profile-header-banner-card">
          <div className="profile-banner-media">
            <div className="profile-banner-overlay"></div>
          </div>
          <div className="profile-header-identity">
            <div className="avatar-container" onClick={() => setShowAvatarModal(true)}>
              <img src={profileData.avatar} alt="User Avatar" className="profile-avatar-img" />
              <div className="avatar-overlay">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
                <span>Change Photo</span>
              </div>
            </div>
            <div className="profile-identity-details">
              <div className="profile-name-tag-row">
                <h3 className="profile-username">{profileData.name}</h3>
                <span className="profile-user-role">{profileData.organisation}</span>
              </div>
              <p className="profile-user-email">{profileData.email}</p>
            </div>
          </div>
        </div>

        <div className="profile-dashboard-grid">
          {/* Left Side Dashboard Nav */}
          <section className="profile-sidebar">
            <nav className="profile-menu">
              <button className={`profile-menu-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                Profile Info
              </button>
              <button className={`profile-menu-item ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M2 9V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4M2 15v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4M2 9a3 3 0 0 1 0 6M22 9a3 3 0 0 0 0 6M12 9v6" />
                </svg>
                My Booked Tickets
              </button>
              <div className="profile-menu-item-container">
                <button className={`profile-menu-item ${activeTab === 'hosted' ? 'active' : ''}`} onClick={() => setActiveTab('hosted')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                  My Hosted Events
                </button>
                {activeTab === 'hosted' && (
                  <div className="profile-menu-sub">
                    <button
                      type="button"
                      className={`profile-menu-sub-item ${hostedFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setHostedFilter('all')}
                    >
                      All Events
                    </button>
                    <button
                      type="button"
                      className={`profile-menu-sub-item ${hostedFilter === 'draft' ? 'active' : ''}`}
                      onClick={() => setHostedFilter('draft')}
                    >
                      Draft
                    </button>
                    <button
                      type="button"
                      className={`profile-menu-sub-item ${hostedFilter === 'published' ? 'active' : ''}`}
                      onClick={() => setHostedFilter('published')}
                    >
                      Published
                    </button>
                    <button
                      type="button"
                      className={`profile-menu-sub-item ${hostedFilter === 'pending' ? 'active' : ''}`}
                      onClick={() => setHostedFilter('pending')}
                    >
                      Pending
                    </button>
                    <button
                      type="button"
                      className={`profile-menu-sub-item ${hostedFilter === 'started' ? 'active' : ''}`}
                      onClick={() => setHostedFilter('started')}
                    >
                      Started
                    </button>
                    <button
                      type="button"
                      className={`profile-menu-sub-item ${hostedFilter === 'completed' ? 'active' : ''}`}
                      onClick={() => setHostedFilter('completed')}
                    >
                      Completed
                    </button>
                    <button
                      type="button"
                      className={`profile-menu-sub-item ${hostedFilter === 'deleted' ? 'active' : ''}`}
                      onClick={() => setHostedFilter('deleted')}
                    >
                      Deleted
                    </button>
                  </div>
                )}
              </div>
              <button className={`profile-menu-item ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Security Settings
              </button>
              <button className={`profile-menu-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                Notifications
              </button>
            </nav>
          </section>

          {/* Right Side Active Tab Pane */}
          <section className="profile-content">
            {/* Mobile Tabs Header list */}
            <div className="mobile-tabs-container">
              <button className={`mobile-tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                <span>Info</span>
              </button>
              <button className={`mobile-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M2 9V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4M2 15v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4M2 9a3 3 0 0 1 0 6M22 9a3 3 0 0 0 0 6M12 9v6" />
                </svg>
                <span>Tickets</span>
              </button>
              <button className={`mobile-tab-btn ${activeTab === 'hosted' ? 'active' : ''}`} onClick={() => setActiveTab('hosted')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
                </svg>
                <span>Hosted</span>
              </button>
              <button className={`mobile-tab-btn ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>Security</span>
              </button>
              <button className={`mobile-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                <span>Alerts</span>
              </button>
            </div>

            {/* TAB 1: PROFILE INFO */}
            {activeTab === 'profile' && (
              <div className="tab-pane">
                <div className="tab-header">
                  <h2 className="tab-title">Personal Information</h2>
                  <p className="tab-desc">Update user summaries, organisation titles, and profile visuals.</p>
                </div>

                <form onSubmit={saveProfile} className="profile-form-grid">
                  <div className="profile-field-group">
                    <label className="profile-field-label">Full Name</label>
                    <div className="profile-input-wrapper">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                      </svg>
                      <input
                        type="text" name="name" className="profile-field-input"
                        value={profileData.name} onChange={handleProfileChange} placeholder="Enter your full name" required
                      />
                    </div>
                  </div>

                  <div className="profile-field-group">
                    <label className="profile-field-label">Email Address (Read-only)</label>
                    <div className="profile-input-wrapper">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                      </svg>
                      <input
                        type="email" className="profile-field-input"
                        value={profileData.email} disabled
                      />
                    </div>
                  </div>

                  <div className="profile-field-group">
                    <label className="profile-field-label">Mobile Number</label>
                    <div className="profile-input-wrapper">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <input
                        type="tel" name="phone" className="profile-field-input"
                        value={profileData.phone} onChange={handleProfileChange} placeholder="e.g. +91 99887 76655"
                      />
                    </div>
                  </div>

                  <div className="profile-field-group">
                    <label className="profile-field-label">Organisation / Host Designation</label>
                    <div className="profile-input-wrapper">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                      <input
                        type="text" name="organisation" className="profile-field-input"
                        value={profileData.organisation} onChange={handleProfileChange} placeholder="Enter your business/designation"
                      />
                    </div>
                  </div>

                  <div className="profile-field-group profile-full-width">
                    <label className="profile-field-label">Short Biography</label>
                    <div className="profile-input-wrapper textarea-wrapper">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                      </svg>
                      <textarea
                        name="bio" className="profile-field-textarea"
                        value={profileData.bio} onChange={handleProfileChange} placeholder="Tell us about yourself, your hobbies or event preferences..."
                      />
                    </div>
                  </div>

                  <div className="form-actions-row profile-full-width">
                    <button type="submit" className="save-changes-btn">Save Changes</button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: MY BOOKED TICKETS */}
            {activeTab === 'bookings' && (
              <div className="tab-pane">
                <div className="tab-header">
                  <h2 className="tab-title">My Event Tickets</h2>
                  <p className="tab-desc">Browse through upcoming vouchers, entry passes, and cancelled bookings.</p>
                </div>

                {ticketsList.length > 0 ? (
                  <div className="tickets-grid">
                    {ticketsList.map((tkt) => (
                      <div key={tkt._doc._id} className="ticket-card" onClick={() => setSelectedTicket(tkt)}>
                        <div className="ticket-banner">
                          <img src={tkt.eventData.bannerImage} alt={tkt.eventData.title} className="ticket-banner-img" />
                          <span className={`ticket-status-badge ${tkt.status}`}>{tkt.status}</span>
                        </div>
                        <div className="ticket-card-body">
                          <span className="ticket-date">{tkt.eventData.date}</span>
                          <h4 className="ticket-title">{tkt.eventData.title}</h4>
                          <div className="ticket-location">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                            </svg>
                            <span>{tkt.location}</span>
                          </div>
                          <div className="ticket-footer-info">
                            <div className="ticket-id-label">ID: <span>{tkt.id}</span></div>
                            <div className="ticket-card-actions">
                              {tkt.status === 'active' && (
                                <button
                                  className="ticket-cancel-link"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    triggerCancelBooking(tkt, e);
                                  }}
                                >
                                  Cancel
                                </button>
                              )}
                              <span className="ticket-view-link">View Pass</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
                    <p>You haven't reserved any tickets yet. Browse GoEvents and sign up!</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: MY HOSTED EVENTS */}
            {activeTab === 'hosted' && (
              <div className="tab-pane">
                <div className="tab-header hosted-header-row">
                  <div>
                    <h2 className="tab-title">My Hosted Workshops</h2>
                    <p className="tab-desc">Track statistics, view publishing statuses, and manage registrations for your hosted events.</p>
                  </div>
                  <button className="create-event-cta-btn" onClick={() => navigate('/GoEvent/event/create-event')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Create Event
                  </button>
                </div>

                {hostedEvents.length > 0 ? (
                  <>
                    <div className="hosted-filters-bar">
                      <button
                        type="button"
                        className={`filter-badge ${hostedFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setHostedFilter('all')}
                      >
                        All Events
                      </button>
                      <button
                        type="button"
                        className={`filter-badge ${hostedFilter === 'draft' ? 'active' : ''}`}
                        onClick={() => setHostedFilter('draft')}
                      >
                        Draft
                      </button>
                      <button
                        type="button"
                        className={`filter-badge ${hostedFilter === 'published' ? 'active' : ''}`}
                        onClick={() => setHostedFilter('published')}
                      >
                        Published
                      </button>
                      <button
                        type="button"
                        className={`filter-badge ${hostedFilter === 'pending' ? 'active' : ''}`}
                        onClick={() => setHostedFilter('pending')}
                      >
                        Pending
                      </button>
                      <button
                        type="button"
                        className={`filter-badge ${hostedFilter === 'started' ? 'active' : ''}`}
                        onClick={() => setHostedFilter('started')}
                      >
                        Started
                      </button>
                      <button
                        type="button"
                        className={`filter-badge ${hostedFilter === 'completed' ? 'active' : ''}`}
                        onClick={() => setHostedFilter('completed')}
                      >
                        Completed
                      </button>
                      <button
                        type="button"
                        className={`filter-badge ${hostedFilter === 'deleted' ? 'active' : ''}`}
                        onClick={() => setHostedFilter('deleted')}
                      >
                        Deleted
                      </button>
                    </div>

                    {hostedEvents.filter(evt => hostedFilter === 'all' || evt.status.toLowerCase() === hostedFilter.toLowerCase()).length > 0 ? (
                      <div className="hosted-table-wrapper">
                        <table className="hosted-table">
                          <thead>
                            <tr>
                              <th>Event Details</th>
                              <th>Category</th>
                              <th>Status</th>
                              <th>Registrations</th>
                              <th>Pricing</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {hostedEvents
                              .filter((evt) => hostedFilter === 'all' || evt.status.toLowerCase() === hostedFilter.toLowerCase())
                              .map((evt) => (
                                <tr key={evt._id}>
                                  <td data-label="Event Details">
                                    <div className="hosted-event-title-cell">
                                      <span className="hosted-event-title" onClick={() => navigate(`/GoEvent/event/${evt._id}`)} title="View Event Page">{evt.title}</span>
                                      <span className="hosted-event-date">
                                        {new Date(evt.startDate).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric'
                                        })}
                                      </span>
                                      <span className="slash" style={{ marginLeft: "20px" }}> to </span>
                                      <span className="hosted-event-date">
                                        {new Date(evt.endDate).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric'
                                        })}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="hosted-category-cell" data-label="Category">
                                    <span className={evt.category.toLowerCase()}>{evt.category}</span>
                                  </td>
                                  <td data-label="Status">
                                    <span className={`status-badge-dot ${evt.status}`}>
                                      {evt.status.charAt(0).toUpperCase() + evt.status.slice(1)}
                                    </span>
                                  </td>
                                  <td data-label="Registrations">
                                    <div className="registration-progress-container">
                                      <div className="registration-progress-text">
                                        <strong>{new Date(evt.registrationDeadline).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: "short",
                                          day: 'numeric'
                                        })}</strong>
                                        <span className="slash">/</span>
                                        <span className="seats-total">{evt.registrationCount}</span>
                                        <span className="progress-percent"> ({Math.round((evt.seatsFilled / evt.registrationCount) * 100)}%)</span>
                                      </div>
                                      <div className="registration-progress-bar-bg">
                                        <div
                                          className="registration-progress-bar-fill"
                                          style={{ width: `${Math.min((evt.seatsFilled / evt.registrationCount) * 100, 100)}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  </td>
                                  <td data-label="Pricing">
                                    <span className="hosted-price-tag">
                                      {evt.price === 0 ? "FREE" : `₹${evt.ticketPrice}`}
                                    </span>
                                  </td>
                                  <td className="table-actions-cell" data-label="Actions">
                                    <button className="table-action-icon-btn" onClick={() => navigate(`/GoEvent/event/${evt._id}`)} title="View Event Page">
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
                                      </svg>
                                    </button>
                                    <button className="table-action-icon-btn delete" onClick={() => navigate(`/GoEvent/${profileData._id}/update/${evt._id}`)} title="Edit Event">
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                      </svg>
                                    </button>
                                    <button className="table-action-icon-btn delete" onClick={() => navigate(`/GoEvent/${profileData._id}/update/${evt._id}`)} title="Booked Tickets">
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M2 9a3 3 0 0 1 0-6h20a3 3 0 0 1 0 6 3 3 0 0 0 0 6 3 3 0 0 1 0 6H2a3 3 0 0 1 0-6 3 3 0 0 0 0-6z" />
                                      </svg>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="hosted-empty-state" style={{ minHeight: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <div className="empty-state-icon">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                        </div>
                        <p className="empty-state-text">No events found matching the "<strong>{hostedFilter}</strong>" status.</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="hosted-empty-state">
                    <div className="empty-state-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    <p className="empty-state-text">No hosted workshops found. Start hosting your own events today!</p>
                    <button className="create-event-cta-btn" onClick={() => navigate('/GoEvent/event/create-event')}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Create Event
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: SECURITY SETTINGS */}
            {activeTab === 'security' && (
              <div className="tab-pane">
                <div className="tab-header">
                  <h2 className="tab-title">Security & Passwords</h2>
                  <p className="tab-desc">Modify access codes, reset keys, and monitor active terminal sessions.</p>
                </div>

                <div className="security-settings-layout">
                  <div className="security-settings-form-col">
                    <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div className="profile-field-group">
                        <label className="profile-field-label">New Security Password</label>
                        <div className="profile-input-wrapper">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                          <input
                            type="password" className="profile-field-input" placeholder="At least 8 characters long"
                            value={securityData.newPassword} onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))} required
                          />
                        </div>
                      </div>

                      <div className="profile-field-group">
                        <label className="profile-field-label">Confirm New Password</label>
                        <div className="profile-input-wrapper">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                          <input
                            type="password" className="profile-field-input" placeholder="Repeat your new password"
                            value={securityData.confirmPassword} onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))} required
                          />
                        </div>
                      </div>

                      {isOtpSent ? (
                        <div className="profile-field-group">
                          <label className="profile-field-label">Email Verification OTP</label>
                          <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <div className="profile-input-wrapper" style={{ flexGrow: 1 }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /><circle cx="12" cy="16" r="1" />
                              </svg>
                              <input
                                type="text" className="profile-field-input" placeholder="Enter 6-digit code"
                                value={securityData.otp} onChange={(e) => setSecurityData(prev => ({ ...prev, otp: e.target.value }))} required
                              />
                            </div>
                            <button
                              type="submit" className="save-changes-btn" disabled={passwordLoading}
                              style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: 'none' }}
                            >
                              {passwordLoading ? "Updating..." : "Update Password"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ marginTop: '0.5rem' }}>
                          <button
                            type="button" className="save-changes-btn"
                            onClick={handleRequestOtp} disabled={otpLoading}
                          >
                            {otpLoading ? "Sending OTP..." : "Verify Identity & Change Password"}
                          </button>
                        </div>
                      )}
                    </form>
                  </div>

                  <div className="security-shield-card">
                    <div className="shield-icon-glow">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    <h5>Security Shield Recommendation</h5>
                    <ul>
                      <li>Use 8+ characters containing numbers, symbols, and capitals.</li>
                      <li>Do not use simple combinations like "123456" or "password".</li>
                      <li>Verify with 2FA email dispatch on every credential modification.</li>
                      <li>Always terminate unknown sessions from active terminals.</li>
                    </ul>
                  </div>
                </div>

                {/* Sessions tracking */}
                <div className="sessions-wrapper">
                  <h4 className="sessions-title">Active Logged-in Devices</h4>
                  <div className="sessions-list">
                    {sessions.map((sess) => {
                      const isMobile = sess.device.toLowerCase().includes('iphone') || sess.device.toLowerCase().includes('android') || sess.device.toLowerCase().includes('phone');
                      return (
                        <div key={sess.id} className="session-item">
                          <div className="session-info">
                            <div className="session-device-icon">
                              {isMobile ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
                                </svg>
                              ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <rect width="14" height="10" x="5" y="3" rx="2" /><rect width="20" height="3" x="2" y="17" rx="1" /><path d="M12 13v4" />
                                </svg>
                              )}
                            </div>
                            <div className="session-details">
                              <h6>{sess.device} · {sess.browser}</h6>
                              <p>{sess.location}</p>
                            </div>
                          </div>
                          {sess.current ? (
                            <span className="session-current-tag">This Device</span>
                          ) : (
                            <button className="session-revoke-btn" onClick={() => revokeSession(sess.id)}>
                              Revoke Access
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="tab-pane">
                <div className="tab-header">
                  <h2 className="tab-title">Notifications Preferences</h2>
                  <p className="tab-desc">Choose when and how GoEvent contacts you via email alerts.</p>
                </div>

                <div className="notification-preference-list">
                  <div className="preference-card">
                    <div className="preference-icon-info">
                      <div className="preference-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                      </div>
                      <div className="preference-details">
                        <h4>Booking Confirmations</h4>
                        <p>Receive email receipts, tickets and QR entry codes upon registration.</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox" checked={notifications.bookingConfirm}
                        onChange={(e) => setNotifications(prev => ({ ...prev, bookingConfirm: e.target.checked }))}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="preference-card">
                    <div className="preference-icon-info">
                      <div className="preference-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </div>
                      <div className="preference-details">
                        <h4>Weekly Event Suggestion Digest</h4>
                        <p>Receive recommendations based on local city and preferred categories.</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox" checked={notifications.weeklyDigest}
                        onChange={(e) => setNotifications(prev => ({ ...prev, weeklyDigest: e.target.checked }))}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="preference-card">
                    <div className="preference-icon-info">
                      <div className="preference-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                        </svg>
                      </div>
                      <div className="preference-details">
                        <h4>Organizer Newsletter Updates</h4>
                        <p>Receive emails about new tips, hosting tools, and update logs.</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox" checked={notifications.newsletters}
                        onChange={(e) => setNotifications(prev => ({ ...prev, newsletters: e.target.checked }))}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="preference-card">
                    <div className="preference-icon-info">
                      <div className="preference-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /><circle cx="12" cy="16" r="1" />
                        </svg>
                      </div>
                      <div className="preference-details">
                        <h4>Account Security Warnings</h4>
                        <p>Notify on unrecognized logins, OTP dispatches, and credential revisions.</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox" checked={notifications.securityAlerts}
                        onChange={(e) => setNotifications(prev => ({ ...prev, securityAlerts: e.target.checked }))}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div> {/* Close profile-dashboard-grid */}
      </main>

      {/* FOOTER */}
      <Footer />

      {/* CHOOSE AVATAR GRID MODAL */}
      {showAvatarModal && (
        <div className="avatar-grid-overlay">
          <div className="avatar-modal">
            <button className="avatar-modal-close" onClick={() => setShowAvatarModal(false)}>&times;</button>
            <h4 className="avatar-grid-title">Choose Profile Avatar</h4>
            <div className="avatar-grid">
              {AVATAR_OPTIONS.map((url, idx) => (
                <button
                  key={idx} type="button"
                  className={`avatar-option-btn ${profileData.avatar === url ? 'selected' : ''}`}
                  onClick={() => selectAvatar(url)}
                >
                  <img src={url} alt={`Avatar Option ${idx}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TICKET DETAILS EXPANDED VIEW MODAL */}
      {selectedTicket && (
        <div className="ticket-modal-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="ticket-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="avatar-modal-close" onClick={() => setSelectedTicket(null)}>&times;</button>
            <div className="ticket-modal-top">
              <img src={selectedTicket.banner} alt={selectedTicket.eventTitle} className="ticket-modal-top-img" />
              <div className="ticket-modal-top-overlay"></div>
            </div>

            <div className="ticket-modal-content">
              <h3 className="ticket-modal-title">{selectedTicket.eventTitle}</h3>
              <span className="ticket-modal-org">Hosted by: {selectedTicket.organizer}</span>

              <div className="qr-code-wrapper">
                {/* Simulated digital SVG QR Code */}
                <svg className="qr-code-svg" width="140" height="140" viewBox="0 0 29 29" fill="none" stroke="#111424" strokeWidth="1" shapeRendering="crispEdges">
                  <path fill="#ffffff" d="M0 0h29v29H0z" />
                  {/* Outer markers */}
                  <path fill="#111424" d="M0 0h7v1H0zm0 6h7v1H0zm0-5h1v4H0zm6 0h1v4H6zm2 0h1v1H8zm2 0h2v1h-2zm3 0h1v1h-1zm3 0h4v1h-4zm5 0h1v1h-1zm1 0h1v1h-1z" />
                  <path fill="#111424" d="M22 0h7v1h-7zm0 6h7v1h-7zm0-5h1v4h-1zm6 0h1v4h-1zM2 2h3v3H2zm20 0h3v3h-3zM0 22h7v1H0zm0 6h7v1H0zm0-5h1v4H0zm6 0h1v4H6zM2 24h3v3H2z" />
                  {/* Internal QR details blocks */}
                  <path fill="#111424" d="M10 10h1v1h-1zm2 0h3v1h-3zm4 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm-10 2h2v1h-2zm3 0h1v2h-1zm2 0h1v1h-1zm3 0h1v1h-1zm2 0h1v1h-1zm2 0h2v1h-2zm-12 2h1v1h-1zm2 0h1v1h-1zm4 0h3v1h-3zm5 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm-14 2h1v2H0zm2 0h1v1H2zm2 0h2v1H4zm3 0h2v1H7zm3 0h1v1h-1zm3 0h1v1h-1zm2 0h2v1h-2zm4 0h1v1h-1zm-17 2h1v1H0zm3 0h2v1H3zm3 0h1v1H6zm4 0h1v1h-1zm2 0h2v1h-2zm6 0h1v1h-1zm2 0h2v1h-2zm-17 2h1v1H0zm2 0h2v1H2zm4 0h1v1H6zm3 0h1v1H9zm2 0h3v1h-3zm4 0h1v1h-1zm2 0h1v1h-1zm2 0h2v1h-2zm-17 2h1v1H0zm3 0h2v1H3zm3 0h1v1H6zm2 0h1v1H8zm4 0h2v1h-2zm5 0h1v1h-1zm1 0h1v1h-1z" />
                </svg>
              </div>
              <span className="qr-scan-label">SCAN AT ENTRANCE</span>

              <div className="ticket-voucher-divider"></div>

              <div className="ticket-receipt-grid">
                <div className="receipt-item">
                  <h5>Ticket ID</h5>
                  <p>{selectedTicket.id}</p>
                </div>
                <div className="receipt-item">
                  <h5>Price Paid</h5>
                  <p>{selectedTicket.price === 0 ? "FREE" : `₹${selectedTicket.price}`}</p>
                </div>
                <div className="receipt-item">
                  <h5>Quantity</h5>
                  <p>{selectedTicket.quantity} Pax</p>
                </div>
                <div className="receipt-item">
                  <h5>Status</h5>
                  <p style={{ color: selectedTicket.status === 'active' ? '#10b981' : selectedTicket.status === 'cancelled' ? '#ef4444' : '#94a3b8' }}>
                    {selectedTicket.status.toUpperCase()}
                  </p>
                </div>
                <div className="receipt-item" style={{ gridColumn: 'span 2' }}>
                  <h5>Venue Address</h5>
                  <p style={{ fontWeight: '500' }}>{selectedTicket.location}</p>
                </div>
                <div className="receipt-item" style={{ gridColumn: 'span 2' }}>
                  <h5>Event Schedule</h5>
                  <p style={{ fontWeight: '500' }}>{selectedTicket.date} · {selectedTicket.time}</p>
                </div>
              </div>

              <div className="ticket-modal-actions" style={{ marginTop: '1.5rem' }}>
                <button type="button" className="ticket-action-btn-primary" onClick={() => setSelectedTicket(null)}>
                  Close Ticket View
                </button>
                {selectedTicket.status === 'active' && (
                  <button type="button" className="ticket-action-btn-danger" onClick={(e) => triggerCancelBooking(selectedTicket, e)}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM BOOKING CANCELLATION WARNING DIALOG */}
      {ticketToCancel && (
        <div className="warning-dialog-overlay">
          <div className="warning-dialog">
            <div className="warning-dialog-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" x2="12" y1="9" y2="13" />
                <line x1="12" x2="12.01" y1="17" y2="17" />
              </svg>
            </div>
            <h4 className="warning-dialog-title">Cancel Ticket Booking?</h4>
            <p className="warning-dialog-desc">
              Are you sure you want to cancel your registration ticket <strong>{ticketToCancel.id}</strong> for "{ticketToCancel.eventTitle}"? This action cannot be undone.
            </p>
            <div className="warning-dialog-buttons">
              <button type="button" className="warning-confirm-btn" onClick={confirmCancelBooking}>
                Yes, Cancel Reservation
              </button>
              <button type="button" className="warning-cancel-btn" onClick={() => setTicketToCancel(null)}>
                Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
