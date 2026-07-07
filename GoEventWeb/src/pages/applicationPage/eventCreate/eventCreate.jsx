import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../../components/navBar/navBar';
import SideBar from '../../../components/sideBar/sideBar';
import Footer from '../../../components/footer/footer';
import Loader from '../../../components/loader/loader';
import { categoriesList } from '../../../utils/mockData';
import ROUTERS from '../../../api/connect.api';
import { CheckUserAuth } from '../../../middleware/chekUserAuth';
import { ToastSuccess, ToastError, ToastWarning, ToastInfo } from '../../../assets/toast';
import './eventCreate.css';
import { createEvent } from '../../../api/postApiHandler/pstData';

export default function EventCreate({ isUserLoggedIn, setIsUserLoggedIn }) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [unauthorized, setUnauthorized] = useState(false);

    // Form fields matching MongoDB schema
    const [formData, setFormData] = useState({
        title: '',
        shortDescription: '',
        description: '',
        category: '',
        bannerImage: '',
        thumbnailImage: '',
        promotionalVideo: '',
        eventMode: 'offline', // online | offline
        venueName: '',
        address: '',
        city: '',
        state: '',
        country: 'India',
        pincode: '',
        googleMapsLink: '',
        meetingLink: '',
        meetingPassword: '',
        startDate: '',
        endDate: '',
        registrationDeadline: '',
        ticketPrice: 0,
        availableSeats: '',
        contactEmail: '',
        contactPhone: '',
        website: '',
        socialLinks: {
            instagram: '',
            facebook: '',
            linkedin: '',
            twitter: '',
            youtube: ''
        },
        speakers: [],
        faqs: [],
        refundPolicy: '',
        termsAndConditions: ''
    });

    // Check user auth on load
    useEffect(() => {
        const authed = CheckUserAuth();
        if (!authed) {
            setUnauthorized(true);
        }
    }, [isUserLoggedIn]);

    // Handle standard inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle nested social links
    const handleSocialChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [name]: value
            }
        }));
    };

    // Dynamic list helpers (Speakers)
    const addSpeaker = () => {
        setFormData((prev) => ({
            ...prev,
            speakers: [...prev.speakers, { name: '', designation: '', company: '', image: '', bio: '' }]
        }));
    };

    const removeSpeaker = (index) => {
        setFormData((prev) => {
            const copy = [...prev.speakers];
            copy.splice(index, 1);
            return { ...prev, speakers: copy };
        });
    };

    const handleSpeakerChange = (index, field, value) => {
        setFormData((prev) => {
            const copy = [...prev.speakers];
            copy[index] = { ...copy[index], [field]: value };
            return { ...prev, speakers: copy };
        });
    };

    // Dynamic list helpers (FAQs)
    const addFaq = () => {
        setFormData((prev) => ({
            ...prev,
            faqs: [...prev.faqs, { question: '', answer: '' }]
        }));
    };

    const removeFaq = (index) => {
        setFormData((prev) => {
            const copy = [...prev.faqs];
            copy.splice(index, 1);
            return { ...prev, faqs: copy };
        });
    };

    const handleFaqChange = (index, field, value) => {
        setFormData((prev) => {
            const copy = [...prev.faqs];
            copy[index] = { ...copy[index], [field]: value };
            return { ...prev, faqs: copy };
        });
    };

    // Validate active step before going next
    const validateStep = (step) => {
        switch (step) {
            case 1:
                if (!formData.title.trim()) return "Event Title is required";
                if (!formData.category) return "Please select a Category";
                if (!formData.shortDescription.trim()) return "Short Description is required";
                if (!formData.description.trim()) return "Detailed Description is required";
                if (!formData.bannerImage.trim()) return "Banner Image URL is required";
                return null;
            case 2:
                if (!formData.startDate) return "Start Date & Time is required";
                if (!formData.endDate) return "End Date & Time is required";

                const start = new Date(formData.startDate);
                const end = new Date(formData.endDate);
                if (end <= start) return "End date must be after the start date";

                if (formData.registrationDeadline) {
                    const deadline = new Date(formData.registrationDeadline);
                    if (deadline > start) return "Registration deadline must be before start date";
                }

                if (Number(formData.ticketPrice) < 0) return "Ticket Price cannot be negative";
                if (formData.availableSeats && Number(formData.availableSeats) <= 0) return "Seats must be greater than 0";
                return null;
            case 3:
                // City and State are required indexes in MongoDB schema
                if (!formData.city.trim()) return "Hosting/Venue City is required";
                if (!formData.state.trim()) return "Hosting/Venue State is required";

                if (formData.eventMode === 'offline') {
                    if (!formData.venueName.trim()) return "Venue name is required for offline events";
                    if (!formData.address.trim()) return "Street Address is required for offline events";
                } else {
                    if (!formData.meetingLink.trim()) return "Meeting Link is required for online events";
                }
                return null;
            case 4:
                if (formData.contactEmail) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(formData.contactEmail)) return "Invalid contact email address";
                }
                return null;
            case 5:
                // Speakers/FAQs are optional, validate structure if details are partially entered
                for (let i = 0; i < formData.speakers.length; i++) {
                    if (!formData.speakers[i].name.trim()) return `Speaker #${i + 1} is missing a Name`;
                }
                for (let i = 0; i < formData.faqs.length; i++) {
                    if (!formData.faqs[i].question.trim() || !formData.faqs[i].answer.trim()) {
                        return `FAQ #${i + 1} must contain both a Question and an Answer`;
                    }
                }
                return null;
            default:
                return null;
        }
    };

    const handleNext = () => {
        const error = validateStep(currentStep);
        if (error) {
            ToastWarning(error);
            return;
        }
        setCurrentStep((prev) => Math.min(prev + 1, 6));
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    // Calculate progress percentage
    const getProgressPercentage = () => {
        return ((currentStep - 1) / 5) * 90 + 5; // bounds between 5% and 95%
    };

    // Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!agreedToTerms) {
            ToastWarning("You must agree to the Terms and Conditions to publish this event.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await createEvent(formData);
            console.log(response);
            if (response.flag) {
                ToastSuccess(response.message || "Event created successfully!");
                setIsSubmitted(true);
            } else {
                ToastError(response.message || "Failed to create event. Please try again.");
            }
        } catch (error) {
            console.error("Submission error:", error);
            ToastError("Network error: Could not reach the event creation server.");
        } finally {
            setIsLoading(false);
        }
    };

    // Renders custom SVGs for steps
    const renderStepIcon = (stepNumber) => {
        if (currentStep > stepNumber) {
            // Checkmark for completed steps
            return (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            );
        }
        return stepNumber;
    };

    // Unauthorized View
    if (unauthorized) {
        return (
            <div className="eventcreate-wrapper">
                <NavBar isUserLoggedIn={isUserLoggedIn} setIsUserLoggedIn={setIsUserLoggedIn} onToggleSidebar={() => setSidebarOpen(true)} tag="create" />
                <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isUserLoggedIn={isUserLoggedIn} setIsUserLoggedIn={setIsUserLoggedIn} tag="create" />
                <div className="eventcreate-unauthorized-container">
                    <div className="unauth-card">
                        <div className="unauth-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>
                        <h2 className="unauth-title">Authentication Required</h2>
                        <p className="unauth-message">
                            Only registered organizers can create events on GoEvent. Please log in or register to publish your workshop, concert, or online meeting.
                        </p>
                        <button className="unauth-btn" onClick={() => navigate('/GoEvent/login')}>
                            Go to Log In
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (isLoading) {
        return <Loader text="Publishing event page & configuration..." />;
    }

    return (
        <div className="eventcreate-wrapper">
            {/* Header / Navbar */}
            <NavBar
                isUserLoggedIn={isUserLoggedIn}
                setIsUserLoggedIn={setIsUserLoggedIn}
                onToggleSidebar={() => setSidebarOpen(true)}
                tag="create"
            />

            {/* Sidebar drawer */}
            <SideBar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isUserLoggedIn={isUserLoggedIn}
                setIsUserLoggedIn={setIsUserLoggedIn}
                tag="create"
            />

            {/* Banner Header */}
            <header className="eventcreate-hero">
                <div className="eventcreate-hero-content">
                    <span className="create-tagline">Organizer Hub</span>
                    <h1 className="hero-title">
                        Launch a New <span className="hero-title-gradient">Event</span>
                    </h1>
                    <p className="hero-subtitle">
                        Build your custom event experience. Host live concerts, online workshops, corporate meetups, or webinars in a few guided steps.
                    </p>
                </div>
                <div className="eventcreate-hero-overlay"></div>
            </header>

            {/* Main Interactive Wizard & Preview Grid */}
            <main className="eventcreate-main-container">
                {/* Stepper Progress bar */}
                <section className="stepper-wrapper">
                    <div className="stepper">
                        <div className="stepper-progress-bar" style={{ width: `${getProgressPercentage()}%` }}></div>

                        <div className={`step-node ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`} onClick={() => currentStep > 1 && setCurrentStep(1)}>
                            <div className="step-badge">{renderStepIcon(1)}</div>
                            <span className="step-text">Essentials</span>
                        </div>

                        <div className={`step-node ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`} onClick={() => currentStep > 2 && setCurrentStep(2)}>
                            <div className="step-badge">{renderStepIcon(2)}</div>
                            <span className="step-text">Schedule & Price</span>
                        </div>

                        <div className={`step-node ${currentStep === 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`} onClick={() => currentStep > 3 && setCurrentStep(3)}>
                            <div className="step-badge">{renderStepIcon(3)}</div>
                            <span className="step-text">Location details</span>
                        </div>

                        <div className={`step-node ${currentStep === 4 ? 'active' : ''} ${currentStep > 4 ? 'completed' : ''}`} onClick={() => currentStep > 4 && setCurrentStep(4)}>
                            <div className="step-badge">{renderStepIcon(4)}</div>
                            <span className="step-text">Contact & Socials</span>
                        </div>

                        <div className={`step-node ${currentStep === 5 ? 'active' : ''} ${currentStep > 5 ? 'completed' : ''}`} onClick={() => currentStep > 5 && setCurrentStep(5)}>
                            <div className="step-badge">{renderStepIcon(5)}</div>
                            <span className="step-text">Speakers & FAQ</span>
                        </div>

                        <div className={`step-node ${currentStep === 6 ? 'active' : ''} ${currentStep > 6 ? 'completed' : ''}`} onClick={() => currentStep > 6 && setCurrentStep(6)}>
                            <div className="step-badge">{renderStepIcon(6)}</div>
                            <span className="step-text">Publish</span>
                        </div>
                    </div>
                </section>

                {/* Left section: Step Forms */}
                <section className="wizard-card-wrapper">
                    {isSubmitted ? (
                        <div className="wizard-card success-screen-wrapper">
                            <div className="checkmark-circle">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <h2 className="success-title">Congratulations!</h2>
                            <p className="success-message">
                                Your event <strong>"{formData.title}"</strong> has been queued for launch. It will display in the directory once verified.
                            </p>
                            <div className="success-btn-group">
                                <button className="success-primary-btn" onClick={() => navigate('/GoEvent/events')}>
                                    Browse Directory
                                </button>
                                <button className="success-secondary-btn" onClick={() => {
                                    setFormData({
                                        title: '', shortDescription: '', description: '', category: '', bannerImage: '',
                                        thumbnailImage: '', promotionalVideo: '', eventMode: 'offline', venueName: '',
                                        address: '', city: '', state: '', country: 'India', pincode: '', googleMapsLink: '',
                                        meetingLink: '', meetingPassword: '', startDate: '', endDate: '', registrationDeadline: '',
                                        ticketPrice: 0, availableSeats: '', contactEmail: '', contactPhone: '', website: '',
                                        socialLinks: { instagram: '', facebook: '', linkedin: '', twitter: '', youtube: '' },
                                        speakers: [], faqs: [], refundPolicy: '', termsAndConditions: ''
                                    });
                                    setIsSubmitted(false);
                                    setCurrentStep(1);
                                    setAgreedToTerms(false);
                                }}>
                                    Create Another Event
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form className="wizard-card" onSubmit={handleSubmit}>
                            <div className="step-content-container">

                                {/* STEP 1: ESSENTIALS */}
                                {currentStep === 1 && (
                                    <div className="step-pane">
                                        <div className="step-header">
                                            <h3 className="step-title">Event Essentials</h3>
                                            <p className="step-desc">Provide primary information about the event name, category, and descriptive details.</p>
                                        </div>
                                        <div className="form-grid">
                                            <div className="form-group full-width">
                                                <label className="form-label label-required" htmlFor="title">Event Title</label>
                                                <input
                                                    type="text" id="title" name="title" className="form-input"
                                                    placeholder="e.g. Rock Fest 2026 or AI Boot Camp"
                                                    value={formData.title} onChange={handleInputChange} required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label label-required" htmlFor="category">Category</label>
                                                <select
                                                    id="category" name="category" className="form-select"
                                                    value={formData.category} onChange={handleInputChange} required
                                                >
                                                    <option value="">-- Choose Category --</option>
                                                    {categoriesList.map((cat) => (
                                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label label-required" htmlFor="bannerImage">Banner Image URL</label>
                                                <input
                                                    type="url" id="bannerImage" name="bannerImage" className="form-input"
                                                    placeholder="https://example.com/banner.jpg"
                                                    value={formData.bannerImage} onChange={handleInputChange} required
                                                />
                                            </div>

                                            <div className="form-group full-width">
                                                <label className="form-label label-required" htmlFor="shortDescription">Short Summary</label>
                                                <input
                                                    type="text" id="shortDescription" name="shortDescription" className="form-input"
                                                    placeholder="A brief hook (maximum 2 lines) displayed in listings."
                                                    value={formData.shortDescription} onChange={handleInputChange} required
                                                />
                                            </div>

                                            <div className="form-group full-width">
                                                <label className="form-label label-required" htmlFor="description">Detailed Description</label>
                                                <textarea
                                                    id="description" name="description" className="form-textarea"
                                                    placeholder="Describe agenda, highlights, instructions, prerequisites, etc."
                                                    value={formData.description} onChange={handleInputChange} required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 2: LOGISTICS & SCHEDULE */}
                                {currentStep === 2 && (
                                    <div className="step-pane">
                                        <div className="step-header">
                                            <h3 className="step-title">Dates & Pricing</h3>
                                            <p className="step-desc">Establish when your event starts, booking limits, and access pricing.</p>
                                        </div>
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label className="form-label label-required" htmlFor="startDate">Start Date & Time</label>
                                                <input
                                                    type="datetime-local" id="startDate" name="startDate" className="form-input"
                                                    value={formData.startDate} onChange={handleInputChange} required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label label-required" htmlFor="endDate">End Date & Time</label>
                                                <input
                                                    type="datetime-local" id="endDate" name="endDate" className="form-input"
                                                    value={formData.endDate} onChange={handleInputChange} required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label" htmlFor="registrationDeadline">Registration Deadline</label>
                                                <input
                                                    type="datetime-local" id="registrationDeadline" name="registrationDeadline" className="form-input"
                                                    value={formData.registrationDeadline} onChange={handleInputChange}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label" htmlFor="ticketPrice">Ticket Price (₹)</label>
                                                <input
                                                    type="number" id="ticketPrice" name="ticketPrice" className="form-input"
                                                    min="0" placeholder="0 for Free entry"
                                                    value={formData.ticketPrice} onChange={handleInputChange}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label" htmlFor="availableSeats">Available Seats / Capacities</label>
                                                <input
                                                    type="number" id="availableSeats" name="availableSeats" className="form-input"
                                                    min="1" placeholder="Unlimited if left blank"
                                                    value={formData.availableSeats} onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3: LOCATION DETAILS */}
                                {currentStep === 3 && (
                                    <div className="step-pane">
                                        <div className="step-header">
                                            <h3 className="step-title">Access & Location</h3>
                                            <p className="step-desc">Decide whether the event is physical (Venue address) or virtual (Meeting links).</p>
                                        </div>

                                        <div className="form-group full-width" style={{ marginBottom: '1.5rem' }}>
                                            <label className="form-label">Select Event Mode</label>
                                            <div className="mode-toggle-container">
                                                <div
                                                    className={`mode-card ${formData.eventMode === 'offline' ? 'selected' : ''}`}
                                                    onClick={() => setFormData(prev => ({ ...prev, eventMode: 'offline' }))}
                                                >
                                                    <div className="mode-icon">
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                                            <circle cx="12" cy="10" r="3" />
                                                        </svg>
                                                    </div>
                                                    <div className="mode-details">
                                                        <h4>Physical Venue</h4>
                                                        <p>On-site address & map location</p>
                                                    </div>
                                                </div>

                                                <div
                                                    className={`mode-card ${formData.eventMode === 'online' ? 'selected' : ''}`}
                                                    onClick={() => setFormData(prev => ({ ...prev, eventMode: 'online' }))}
                                                >
                                                    <div className="mode-icon">
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="m22 8-6 4 6 4V8Z" />
                                                            <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
                                                        </svg>
                                                    </div>
                                                    <div className="mode-details">
                                                        <h4>Online / Virtual</h4>
                                                        <p>Webinar link, password & codes</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-grid">
                                            {/* Offline conditional fields */}
                                            {formData.eventMode === 'offline' ? (
                                                <>
                                                    <div className="form-group full-width">
                                                        <label className="form-label label-required" htmlFor="venueName">Venue Name</label>
                                                        <input
                                                            type="text" id="venueName" name="venueName" className="form-input"
                                                            placeholder="e.g. Science Auditorium or Central Park Ground"
                                                            value={formData.venueName} onChange={handleInputChange} required
                                                        />
                                                    </div>
                                                    <div className="form-group full-width">
                                                        <label className="form-label label-required" htmlFor="address">Street Address</label>
                                                        <input
                                                            type="text" id="address" name="address" className="form-input"
                                                            placeholder="Building block, road, sector details"
                                                            value={formData.address} onChange={handleInputChange} required
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label" htmlFor="pincode">Pincode / ZIP Code</label>
                                                        <input
                                                            type="text" id="pincode" name="pincode" className="form-input"
                                                            value={formData.pincode} onChange={handleInputChange}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label" htmlFor="googleMapsLink">Google Maps Link</label>
                                                        <input
                                                            type="url" id="googleMapsLink" name="googleMapsLink" className="form-input"
                                                            placeholder="https://maps.google.com/..."
                                                            value={formData.googleMapsLink} onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="form-group full-width">
                                                        <label className="form-label label-required" htmlFor="meetingLink">Meeting Link / Webinar URL</label>
                                                        <input
                                                            type="url" id="meetingLink" name="meetingLink" className="form-input"
                                                            placeholder="Zoom, Google Meet, MS Teams, etc."
                                                            value={formData.meetingLink} onChange={handleInputChange} required
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label" htmlFor="meetingPassword">Meeting Password / Access Key</label>
                                                        <input
                                                            type="text" id="meetingPassword" name="meetingPassword" className="form-input"
                                                            placeholder="Code/password to join (if any)"
                                                            value={formData.meetingPassword} onChange={handleInputChange}
                                                        />
                                                    </div>
                                                    <div className="form-group" style={{ visibility: 'hidden' }}></div>
                                                </>
                                            )}

                                            {/* Common Required fields for MongoDB Indexes */}
                                            <div className="form-group">
                                                <label className="form-label label-required" htmlFor="city">City</label>
                                                <input
                                                    type="text" id="city" name="city" className="form-input"
                                                    placeholder="e.g. Mumbai or Virtual/Remote"
                                                    value={formData.city} onChange={handleInputChange} required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label label-required" htmlFor="state">State</label>
                                                <input
                                                    type="text" id="state" name="state" className="form-input"
                                                    placeholder="e.g. Maharashtra or Online"
                                                    value={formData.state} onChange={handleInputChange} required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label" htmlFor="country">Country</label>
                                                <input
                                                    type="text" id="country" name="country" className="form-input"
                                                    value={formData.country} onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 4: CONTACT & SOCIAL LINKS */}
                                {currentStep === 4 && (
                                    <div className="step-pane">
                                        <div className="step-header">
                                            <h3 className="step-title">Contact & Socials</h3>
                                            <p className="step-desc">Establish paths for customer queries and connect social platforms.</p>
                                        </div>
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="contactEmail">Contact Email</label>
                                                <input
                                                    type="email" id="contactEmail" name="contactEmail" className="form-input"
                                                    placeholder="info@yourcompany.com"
                                                    value={formData.contactEmail} onChange={handleInputChange}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label" htmlFor="contactPhone">Contact Phone</label>
                                                <input
                                                    type="tel" id="contactPhone" name="contactPhone" className="form-input"
                                                    placeholder="e.g. +91 9988776655"
                                                    value={formData.contactPhone} onChange={handleInputChange}
                                                />
                                            </div>

                                            <div className="form-group full-width">
                                                <label className="form-label" htmlFor="website">Official Website URL</label>
                                                <input
                                                    type="url" id="website" name="website" className="form-input"
                                                    placeholder="https://mywebsite.com"
                                                    value={formData.website} onChange={handleInputChange}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label" htmlFor="instagram">Instagram Username</label>
                                                <input
                                                    type="text" id="instagram" name="instagram" className="form-input"
                                                    placeholder="username"
                                                    value={formData.socialLinks.instagram} onChange={handleSocialChange}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label" htmlFor="linkedin">LinkedIn Profile URL</label>
                                                <input
                                                    type="text" id="linkedin" name="linkedin" className="form-input"
                                                    placeholder="https://linkedin.com/in/username"
                                                    value={formData.socialLinks.linkedin} onChange={handleSocialChange}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label" htmlFor="facebook">Facebook Page URL</label>
                                                <input
                                                    type="text" id="facebook" name="facebook" className="form-input"
                                                    placeholder="https://facebook.com/..."
                                                    value={formData.socialLinks.facebook} onChange={handleSocialChange}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label" htmlFor="twitter">Twitter / X Handle</label>
                                                <input
                                                    type="text" id="twitter" name="twitter" className="form-input"
                                                    placeholder="username"
                                                    value={formData.socialLinks.twitter} onChange={handleSocialChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 5: SPEAKERS & FAQ */}
                                {currentStep === 5 && (
                                    <div className="step-pane">
                                        <div className="step-header">
                                            <h3 className="step-title">Speakers & FAQs (Optional)</h3>
                                            <p className="step-desc">Highlight guest hosts, program speakers, and answers to common guest questions.</p>
                                        </div>

                                        {/* Speakers Section */}
                                        <div style={{ marginBottom: '2.5rem' }}>
                                            <h4 style={{ margin: '0 0 1rem 0', color: '#cbd5e1' }}>Event Speakers</h4>
                                            <div className="repeater-container">
                                                {formData.speakers.map((spk, idx) => (
                                                    <div key={idx} className="repeater-item">
                                                        <button type="button" className="remove-repeater-btn" onClick={() => removeSpeaker(idx)}>&times;</button>
                                                        <div className="form-grid">
                                                            <div className="form-group">
                                                                <label className="form-label label-required">Speaker Name</label>
                                                                <input
                                                                    type="text" className="form-input" placeholder="Full name"
                                                                    value={spk.name} onChange={(e) => handleSpeakerChange(idx, 'name', e.target.value)} required
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="form-label">Designation / Role</label>
                                                                <input
                                                                    type="text" className="form-input" placeholder="e.g. Lead Guitarist or Senior Consultant"
                                                                    value={spk.designation} onChange={(e) => handleSpeakerChange(idx, 'designation', e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="form-label">Company / Band</label>
                                                                <input
                                                                    type="text" className="form-input" placeholder="e.g. Spotify or Independent"
                                                                    value={spk.company} onChange={(e) => handleSpeakerChange(idx, 'company', e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="form-label">Speaker Image URL</label>
                                                                <input
                                                                    type="url" className="form-input" placeholder="https://example.com/avatar.jpg"
                                                                    value={spk.image} onChange={(e) => handleSpeakerChange(idx, 'image', e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="form-group full-width">
                                                                <label className="form-label">Bio Details</label>
                                                                <textarea
                                                                    rows="2" className="form-input" style={{ minHeight: '60px' }} placeholder="Short introductory sentence..."
                                                                    value={spk.bio} onChange={(e) => handleSpeakerChange(idx, 'bio', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <button type="button" className="add-repeater-btn" onClick={addSpeaker} style={{ marginTop: '1rem' }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" />
                                                </svg>
                                                Add Event Speaker
                                            </button>
                                        </div>

                                        {/* FAQs Section */}
                                        <div>
                                            <h4 style={{ margin: '0 0 1rem 0', color: '#cbd5e1' }}>Frequently Asked Questions</h4>
                                            <div className="repeater-container">
                                                {formData.faqs.map((faq, idx) => (
                                                    <div key={idx} className="repeater-item">
                                                        <button type="button" className="remove-repeater-btn" onClick={() => removeFaq(idx)}>&times;</button>
                                                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                                                            <label className="form-label label-required">Question</label>
                                                            <input
                                                                type="text" className="form-input" placeholder="e.g. Is parking available? or Do we get certificate?"
                                                                value={faq.question} onChange={(e) => handleFaqChange(idx, 'question', e.target.value)} required
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="form-label label-required">Answer</label>
                                                            <textarea
                                                                rows="2" className="form-input" style={{ minHeight: '60px' }} placeholder="Provide detailed response..."
                                                                value={faq.answer} onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)} required
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <button type="button" className="add-repeater-btn" onClick={addFaq} style={{ marginTop: '1rem' }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" />
                                                </svg>
                                                Add FAQ Item
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 6: REVIEW & PUBLISH */}
                                {currentStep === 6 && (
                                    <div className="step-pane">
                                        <div className="step-header">
                                            <h3 className="step-title">Review & Launch</h3>
                                            <p className="step-desc">Accept policies, double check event data, and publish live to the community.</p>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                            <div className="form-group full-width">
                                                <label className="form-label" htmlFor="refundPolicy">Refund Policy / Ticket Policies</label>
                                                <textarea
                                                    id="refundPolicy" name="refundPolicy" className="form-textarea"
                                                    placeholder="Specify rules for refund, cancellation, ticket transfers..."
                                                    value={formData.refundPolicy} onChange={handleInputChange}
                                                />
                                            </div>

                                            <div className="form-group full-width">
                                                <label className="form-label" htmlFor="termsAndConditions">Terms & Conditions</label>
                                                <textarea
                                                    id="termsAndConditions" name="termsAndConditions" className="form-textarea"
                                                    placeholder="Specify age limits, item restrictions, security checks..."
                                                    value={formData.termsAndConditions} onChange={handleInputChange}
                                                />
                                            </div>

                                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <input
                                                    type="checkbox" id="agreed" checked={agreedToTerms}
                                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                                    style={{ width: '18px', height: '18px', cursor: 'pointer', marginTop: '3px' }}
                                                />
                                                <label htmlFor="agreed" style={{ fontSize: '0.85rem', color: '#94a3b8', cursor: 'pointer', lineHeight: '1.4' }}>
                                                    I authorize that all event photos, scheduling dates, venue addresses, and description details provided are accurate. I acknowledge that tickets sale collections will be routed via GoEvent Escrow protocols.
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Buttons footer */}
                            <div className="wizard-actions">
                                <button
                                    type="button"
                                    className="back-btn"
                                    onClick={handleBack}
                                    disabled={currentStep === 1}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="19" x2="5" y1="12" y2="12" /><polyline points="12 19 5 12 12 5" />
                                    </svg>
                                    Back
                                </button>

                                {currentStep < 6 ? (
                                    <button
                                        type="button"
                                        className="next-btn"
                                        onClick={handleNext}
                                    >
                                        Next Step
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" x2="19" y1="12" y2="12" /><polyline points="12 5 19 12 12 19" />
                                        </svg>
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="next-btn"
                                        style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.25)' }}
                                    >
                                        Publish Event
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </form>
                    )}
                </section>

                {/* Right section: Live preview card */}
                <section className="preview-sticky-panel">
                    <div className="preview-header-label">
                        <span className="preview-pulse"></span>
                        Live Preview Card
                    </div>

                    <div className="live-preview-card">
                        <div className="preview-banner">
                            {formData.bannerImage ? (
                                <img src={formData.bannerImage} alt="Event banner preview" className="preview-banner-img" onError={(e) => {
                                    e.target.style.display = 'none';
                                }} />
                            ) : (
                                <div className="preview-banner-placeholder">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                        <circle cx="9" cy="9" r="2" />
                                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                    </svg>
                                    <span style={{ fontSize: '0.75rem' }}>No Banner Uploaded</span>
                                </div>
                            )}

                            {formData.category && (
                                <div className="preview-category-badge">
                                    {formData.category}
                                </div>
                            )}

                            <div className="preview-price-badge">
                                {Number(formData.ticketPrice) === 0 ? "FREE" : `₹${formData.ticketPrice}`}
                            </div>
                        </div>

                        <div className="preview-body">
                            <span className="preview-date">
                                {formData.startDate ? (
                                    new Date(formData.startDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
                                ) : (
                                    "Mon, 1 Jan | 00:00 AM"
                                )}
                            </span>

                            <h4 className="preview-title">
                                {formData.title || "Untitled Special Event"}
                            </h4>

                            <p className="preview-desc">
                                {formData.shortDescription || "Write a brief attractive slogan or description highlights of your event."}
                            </p>

                            <div className="preview-meta">
                                <div className="preview-meta-item">
                                    <svg className="preview-meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    <span className="preview-meta-text">
                                        {formData.endDate ? (
                                            `Ends ${new Date(formData.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                        ) : (
                                            "Duration: TBD"
                                        )}
                                    </span>
                                </div>

                                <div className="preview-meta-item">
                                    <svg className="preview-meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <span className="preview-meta-text">
                                        {formData.eventMode === 'online' ? (
                                            "Online Webinar"
                                        ) : (
                                            formData.venueName || "Venue not selected"
                                        )}
                                    </span>
                                </div>

                                <div className="preview-meta-item">
                                    <svg className="preview-meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                        <path d="M2 12h20" />
                                    </svg>
                                    <span className="preview-meta-text">
                                        {formData.city || "City"}
                                        {formData.state ? `, ${formData.state}` : ''}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
