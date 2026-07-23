import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvatarPath } from '../../utils/avatar_utils';
import './profile_page.css';

// Import sub-tabs
import OverviewTab from './overview_component/overview_tab';
import MyEventsTab from './my_events_component/my_events_tab';
import TicketBookingTab from './ticket_booking_component/ticket_booking_tab';
import CreateEventTab from './create_event_component/create_event_tab';
import ProfileSettingsTab from './profile_settings_component/profile_settings_tab';
import SecurityTab from './security_component/security_tab';
import NotificationTab from './notification_component/notification_tab';
import HelpSupportTab from './help_support_component/help_support_tab';
import { GET_USER_LOG_OUT } from '../../apis/sender';
import { ToastSuccess, ToastError } from '../../utils/toast_notification';

export default function ProfilePage({ isUserLoggedIN, setIsUserLoggedIn, getTheam, initialTab = 'overview' }) {
  const navigate = useNavigate();
  // Current active tab selection
  const [activeTab, setActiveTab] = useState(initialTab);

  // Check authentication and load initial user data once on mount
  const [getUserData, setUserData] = useState({});
  useEffect(() => {
    const raw = localStorage.getItem("GoEventUserData");
    if (raw) {
      setIsUserLoggedIn(true);
      setUserData(JSON.parse(raw));
    } else {
      navigate("/login");
      ToastError("Please Login first");
      return;
    }
  }, []);

  // Local state for user details, initialized from props or fallback values
  const [userData, setUserDataLocal] = useState({
    name: getUserData?.name || 'N/A',
    email: getUserData?.email || 'N/A',
    phone: getUserData?.phone || 'N/A',
    location: getUserData?.location || 'N/A',
    bio: getUserData?.bio || 'N/A',
    website: getUserData?.website || 'N/A',
    avatar: getUserData?.avatar !== undefined ? getUserData?.avatar : 10,
    memberSince: new Date(getUserData?.memberSince).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) || 'N/A',
    role: getUserData?.role || 'N/A',
  });

  // Sync local state when getUserData props update
  useEffect(() => {
    if (getUserData && Object.keys(getUserData).length > 0) {
      setUserDataLocal({
        name: getUserData.name || 'N/A',
        email: getUserData.email || 'N/A',
        phone: getUserData.phone || 'N/A',
        location: getUserData.location || 'India',
        bio: getUserData.bio || 'N/A',
        website: getUserData.website || 'N/A',
        avatar: getUserData.avatar !== undefined ? getUserData.avatar : 10,
        memberSince: getUserData.memberSince ? new Date(getUserData.memberSince).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A',
        role: getUserData.role || 'N/A'
      });
    }
  }, [getUserData?.name, getUserData?.email, getUserData?.phone, getUserData?.location, getUserData?.bio, getUserData?.website, getUserData?.avatar, getUserData?.memberSince, getUserData?.role]);

  const handleSaveUserData = (updatedData) => {
    setUserDataLocal(updatedData);
    if (typeof setUserData === 'function') {
      setUserData(updatedData);
    }
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {

      const response = await GET_USER_LOG_OUT();
      if (response.success && response.status === 200) {
        localStorage.removeItem('GoEventUserData');
        setIsUserLoggedIn(false);
        ToastSuccess(response.message);
        navigate("/GoEvent");
        return;
      }
      ToastError(response.message);
    }
  };

  // Define sidebar navigation options
  const sidebarItems = [
    {
      id: 'tickets_bookings',
      label: 'Tickets & Bookings',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"></path>
        </svg>
      )
    },
    {
      id: 'settings',
      label: 'Profile Settings',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      )
    },
    {
      id: 'security',
      label: 'Security',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      )
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      )
    },
    {
      id: 'help_support',
      label: 'Help & Support',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      )
    }
  ];

  // Render tab contents dynamically
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab userData={userData} onTabChange={setActiveTab} />;
      case 'my_events':
        return <MyEventsTab onTabChange={setActiveTab} />;
      case 'create_event':
        return <CreateEventTab userData={userData} onTabChange={setActiveTab} />;
      case 'tickets_bookings':
        return <TicketBookingTab />;
      case 'settings':
        return <ProfileSettingsTab userData={userData} onSave={handleSaveUserData} theme={getTheam} />;
      case 'security':
        return <SecurityTab theme={getTheam} />;
      case 'notifications':
        return <NotificationTab theme={getTheam} />;
      case 'help_support':
        return <HelpSupportTab theme={getTheam} />;
      default:
        return <OverviewTab userData={userData} onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="profile-page-root">

      {/* Profile Header Banner */}
      <section className="profile-hero-banner">
        <div className="banner-glowing-glow"></div>
        <div className="banner-wave-lines"></div>

        <div className="banner-content-container container">
          {/* Avatar Area */}
          <div className="profile-avatar-wrapper">
            <img
              src={getAvatarPath(userData.avatar)}
              alt={userData.name}
              className="profile-avatar-img"
            />
          </div>

          {/* Profile Name and Stats */}
          <div className="profile-info-and-stats">
            <div className="profile-name-row">
              <h1 className="profile-display-name">{userData.name}</h1>
              <span className="profile-role-badge">{userData.role}</span>
            </div>

            {/* Quick Stats Grid */}
            <div className="profile-stats-grid">
              <div className="stat-grid-item">
                <div className="stat-icon-circle">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <div className="stat-meta">
                  <span className="stat-num">25</span>
                  <span className="stat-title">Events Hosted</span>
                </div>
              </div>

              <div className="stat-grid-item">
                <div className="stat-icon-circle">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"></path>
                  </svg>
                </div>
                <div className="stat-meta">
                  <span className="stat-num">1.2k</span>
                  <span className="stat-title">Tickets Sold</span>
                </div>
              </div>

              <div className="stat-grid-item">
                <div className="stat-icon-circle">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <div className="stat-meta">
                  <span className="stat-num">4.8</span>
                  <span className="stat-title">Ratings</span>
                </div>
              </div>

              <div className="stat-grid-item">
                <div className="stat-icon-circle">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="stat-meta">
                  <span className="stat-num">3</span>
                  <span className="stat-title">Years on GoEvent</span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="edit-profile-button-col">
            <button
              type="button"
              className="btn btn-secondary edit-profile-action-btn"
              onClick={() => setActiveTab('settings')}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="edit-icon">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit Profile
            </button>
          </div>
        </div>
      </section>

      {/* Main Page Layout Container */}
      <section className="profile-layout-container container">

        {/* Left Side Navigation Panel (Hidden on Mobile) */}
        <aside className="profile-left-sidebar">
          <div className="sidebar-nav-list">

            {/*   button for the overview option */}
            <button
              type="button"
              className={`sidebar-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <span className="sidebar-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="9" rx="1"></rect>
                  <rect x="14" y="3" width="7" height="5" rx="1"></rect>
                  <rect x="14" y="12" width="7" height="9" rx="1"></rect>
                  <rect x="3" y="16" width="7" height="5" rx="1"></rect>
                </svg>
              </span>
              <span className="sidebar-label">Overview</span>
            </button>

            {/*  button for the my event option */}
            {userData.role != "USER" &&
              <>
                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'my_events' ? 'active' : ''}`}
                  onClick={() => setActiveTab('my_events')}
                >
                  <span className="sidebar-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </span>
                  <span className="sidebar-label">My Events</span>
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'create_event' ? 'active' : ''}`}
                  onClick={() => setActiveTab('create_event')}
                >
                  <span className="sidebar-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </span>
                  <span className="sidebar-label">Create Event</span>
                </button>
              </>
            }

            {sidebarItems.map(item => (
              <button
                key={item.id}
                type="button"
                className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </button>
            ))}

          </div>

          <div className="sidebar-footer-section">
            <button
              type="button"
              className="sidebar-nav-item logout-nav-item"
              onClick={handleLogout}
            >
              <span className="sidebar-icon text-danger">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </span>
              <span className="sidebar-label text-danger">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Render Box */}
        <main className="profile-main-content-area">
          {renderTabContent()}
        </main>

      </section>

      {/* Mobile Bottom Navigation Bar (Visible only on width < 768px) */}
      <nav className="mobile-bottom-nav-bar">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`mobile-nav-link ${activeTab === 'overview' ? 'active' : ''}`}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="9" rx="1"></rect>
            <rect x="14" y="3" width="7" height="5" rx="1"></rect>
            <rect x="14" y="12" width="7" height="9" rx="1"></rect>
            <rect x="3" y="16" width="7" height="5" rx="1"></rect>
          </svg>
          <span>Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tickets_bookings')}
          className={`mobile-nav-link ${activeTab === 'tickets_bookings' ? 'active' : ''}`}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"></path>
          </svg>
          <span>Tickets</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`mobile-nav-link ${activeTab === 'settings' ? 'active' : ''}`}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          <span>Settings</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('overview');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`mobile-nav-link ${activeTab === 'overview' ? 'active' : ''}`}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>Profile</span>
        </button>
      </nav>

    </div>
  );
}
