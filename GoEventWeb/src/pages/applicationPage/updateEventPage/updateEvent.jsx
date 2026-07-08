import { useEffect, useState } from "react";
import { getEventById } from '../../../api/getApiHandler/getData';
import { useNavigate } from "react-router-dom";
import { ToastMessage, ToastSuccess, ToastError, ToastWarning } from '../../../assets/toast.jsx';
import { useParams } from 'react-router-dom';
import NavBar from '../../../components/navBar/navBar';
import SideBar from '../../../components/sideBar/sideBar';
import Footer from '../../../components/footer/footer';
import Loader from '../../../components/loader/loader';
import { updateEventData } from "../../../api/postApiHandler/pstData.jsx";
import { CheckUserAuth } from '../../../middleware/chekUserAuth';
import { categoriesList } from '../../../utils/mockData';
import "./updateEvent.css";

export const UpdateEvent = ({ isUserLoggedIn, setIsUserLoggedIn }) => {
    const navigate = useNavigate();
    const { uid, eid } = useParams();

    // UI states
    const [isLoader, setIsloader] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('essentials'); // essentials | schedule | location | contacts | speakers
    const [errors, setErrors] = useState({});

    // Modals
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Initial and current form data states
    const [originalData, setOriginalData] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        shortDescription: "",
        description: "",
        category: "",
        bannerImage: "",
        thumbnailImage: "",
        promotionalVideo: "",
        eventMode: "offline", // online | offline
        venueName: "",
        address: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
        googleMapsLink: "",
        meetingLink: "",
        meetingPassword: "",
        startDate: "",
        endDate: "",
        registrationDeadline: "",
        ticketPrice: 0,
        availableSeats: "",
        contactEmail: "",
        contactPhone: "",
        website: "",
        socialLinks: {
            instagram: "",
            facebook: "",
            linkedin: "",
            twitter: "",
            youtube: ""
        },
        speakers: [],
        faqs: [],
        refundPolicy: "",
        termsAndConditions: "",
        paymentQr: "",
        paymentUPI: "",
        paymentUPTName: "",
        status: "draft"
    });

    const currentStatus = formData.status || "draft";
    const isReadOnly = ["completed", "cancelled", "deleted"].includes(currentStatus);

    // Locking rules:
    // "completed", "cancelled", "deleted" => lock everything.
    // "pending", "published" => lock capacity, mode, payment options.
    // "draft" => all editable (except otherData backend fields).
    const isFieldLocked = (fieldName) => {
        if (isReadOnly) return true;
        if (["pending", "published"].includes(currentStatus)) {
            return ["availableSeats", "eventMode", "paymentQr", "paymentUPI", "paymentUPTName"].includes(fieldName);
        }
        return false;
    };

    const renderLockBadge = (fieldName) => {
        if (isFieldLocked(fieldName)) {
            return (
                <span className="label-locked-badge">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Locked
                </span>
            );
        }
        return null;
    };

    const CheckAuth = () => {
        const authed = CheckUserAuth();
        if (!authed) {
            ToastError("Please log in to edit event configuration.");
            navigate("/GoEvent/login");
            return false;
        }
        return true;
    };

    const setEventOldData = async () => {
        const res = await getEventById(eid);
        if (!res.flag) {
            ToastError("Event not Found!");
            navigate("/GoEvent/profile");
            return;
        }

        const organizerId = typeof res.data.data.organizer === 'object' ? res.data.data.organizer._id : res.data.data.organizer;
        if (organizerId !== uid) {
            ToastError("You are not authorized to update this event!");
            navigate("/GoEvent/profile");
            return;
        }

        const {
            address = "", availableSeats = "", bannerImage = "", category = "", city = "", contactEmail = "", contactPhone = "", country = "India",
            description = "", endDate = "", eventMode = "offline", faqs = [], googleMapsLink = "", meetingLink = "", meetingPassword = "",
            paymentQr = "", paymentUPI = "", paymentUPTName = "", promotionalVideo = "", refundPolicy = "", registrationDeadline = "",
            shortDescription = "", socialLinks = {}, speakers = [], startDate = "", state = "", termsAndConditions = "",
            thumbnailImage = "", ticketPrice = 0, title = "", venueName = "", website = "", pincode = "", status = "draft"
        } = res.data.data;

        // Convert ISO date strings to datetime-local values (YYYY-MM-DDTHH:MM)
        const formatDateTime = (dateStr) => {
            if (!dateStr) return "";
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return "";
            const pad = (n) => n.toString().padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        };

        const formattedStartDate = formatDateTime(startDate);
        const formattedEndDate = formatDateTime(endDate);
        const formattedDeadline = formatDateTime(registrationDeadline);

        const loadedData = {
            title,
            shortDescription,
            description,
            category,
            bannerImage,
            thumbnailImage: thumbnailImage || "",
            promotionalVideo: promotionalVideo || "",
            eventMode,
            venueName: venueName || "",
            address: address || "",
            city: city || "",
            state: state || "",
            country: country || "",
            pincode: pincode || "",
            googleMapsLink: googleMapsLink || "",
            meetingLink: meetingLink || "",
            meetingPassword: meetingPassword || "",
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            registrationDeadline: formattedDeadline,
            ticketPrice: ticketPrice || 0,
            availableSeats: availableSeats || "",
            contactEmail: contactEmail || "",
            contactPhone: contactPhone || "",
            website: website || "",
            socialLinks: {
                instagram: socialLinks?.instagram || "",
                facebook: socialLinks?.facebook || "",
                linkedin: socialLinks?.linkedin || "",
                twitter: socialLinks?.twitter || "",
                youtube: socialLinks?.youtube || ""
            },
            speakers: speakers || [],
            faqs: faqs || [],
            refundPolicy: refundPolicy || "",
            termsAndConditions: termsAndConditions || "",
            paymentQr: paymentQr || "",
            paymentUPI: paymentUPI || "",
            paymentUPTName: paymentUPTName || "",
            status: status || "draft"
        };

        setFormData(loadedData);
        setOriginalData(loadedData);
    };

    useEffect(() => {
        const init = async () => {
            setIsloader(true);
            const authed = CheckAuth();
            if (authed) {
                await setEventOldData();
            }
            setIsloader(false);
        };
        init();
    }, [eid, uid]);

    // Handle standard inputs
    const handleInputChange = (e) => {
        if (isReadOnly) return;
        const { name, value } = e.target;

        // Block updates if field is locked
        if (isFieldLocked(name)) return;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        // Remove validation error outline once user edits it
        if (errors[name]) {
            setErrors((prev) => {
                const copy = { ...prev };
                delete copy[name];
                return copy;
            });
        }
    };

    // Handle social links
    const handleSocialChange = (e) => {
        if (isReadOnly) return;
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [name]: value
            }
        }));
    };

    // Dynamic speakers helpers
    const addSpeaker = () => {
        if (isReadOnly) return;
        setFormData((prev) => ({
            ...prev,
            speakers: [...prev.speakers, { name: '', designation: '', company: '', image: '', bio: '' }]
        }));
    };

    const removeSpeaker = (index) => {
        if (isReadOnly) return;
        setFormData((prev) => {
            const copy = [...prev.speakers];
            copy.splice(index, 1);
            return { ...prev, speakers: copy };
        });

        setErrors((prev) => {
            const copy = { ...prev };
            delete copy[`speaker_${index}_name`];
            return copy;
        });
    };

    const handleSpeakerChange = (index, field, value) => {
        if (isReadOnly) return;
        setFormData((prev) => {
            const copy = [...prev.speakers];
            copy[index] = { ...copy[index], [field]: value };
            return { ...prev, speakers: copy };
        });

        if (field === 'name' && value.trim()) {
            setErrors((prev) => {
                const copy = { ...prev };
                delete copy[`speaker_${index}_name`];
                return copy;
            });
        }
    };

    // Dynamic FAQs helpers
    const addFaq = () => {
        if (isReadOnly) return;
        setFormData((prev) => ({
            ...prev,
            faqs: [...prev.faqs, { question: '', answer: '' }]
        }));
    };

    const removeFaq = (index) => {
        if (isReadOnly) return;
        setFormData((prev) => {
            const copy = [...prev.faqs];
            copy.splice(index, 1);
            return { ...prev, faqs: copy };
        });

        setErrors((prev) => {
            const copy = { ...prev };
            delete copy[`faq_${index}_question`];
            delete copy[`faq_${index}_answer`];
            return copy;
        });
    };

    const handleFaqChange = (index, field, value) => {
        if (isReadOnly) return;
        setFormData((prev) => {
            const copy = [...prev.faqs];
            copy[index] = { ...copy[index], [field]: value };
            return { ...prev, faqs: copy };
        });

        if (value.trim()) {
            setErrors((prev) => {
                const copy = { ...prev };
                delete copy[`faq_${index}_${field}`];
                return copy;
            });
        }
    };

    // Validation rules
    const validateForm = () => {
        const newErrors = {};

        // Essentials Tab
        if (!formData.title.trim()) newErrors.title = "Event Title is required";
        if (!formData.category) newErrors.category = "Category is required";
        if (!formData.shortDescription.trim()) newErrors.shortDescription = "Short Summary is required";
        if (!formData.description.trim()) newErrors.description = "Detailed Description is required";
        if (!formData.bannerImage.trim()) newErrors.bannerImage = "Banner Image URL is required";

        // Schedule & Price Tab
        if (!formData.startDate) {
            newErrors.startDate = "Start Date & Time is required";
        }
        if (!formData.endDate) {
            newErrors.endDate = "End Date & Time is required";
        }
        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);
            if (end <= start) {
                newErrors.endDate = "End date must be after the start date";
            }
        }
        if (formData.registrationDeadline && formData.startDate) {
            const deadline = new Date(formData.registrationDeadline);
            const start = new Date(formData.startDate);
            if (deadline > start) {
                newErrors.registrationDeadline = "Deadline must be before the start date";
            }
        }
        if (formData.ticketPrice !== undefined && formData.ticketPrice !== "") {
            if (Number(formData.ticketPrice) < 0) {
                newErrors.ticketPrice = "Price cannot be negative";
            }
        }
        if (!isFieldLocked("availableSeats") && formData.availableSeats !== undefined && formData.availableSeats !== "") {
            if (Number(formData.availableSeats) <= 0) {
                newErrors.availableSeats = "Capacity must be greater than 0";
            }
        }

        // Access/Location Tab
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.state.trim()) newErrors.state = "State is required";

        if (formData.eventMode === 'offline') {
            if (!formData.venueName.trim()) newErrors.venueName = "Venue name is required";
            if (!formData.address.trim()) newErrors.address = "Street Address is required";
        } else {
            if (!formData.meetingLink.trim()) {
                newErrors.meetingLink = "Meeting Link is required";
            } else {
                try {
                    new URL(formData.meetingLink);
                } catch (_) {
                    newErrors.meetingLink = "Must be a valid URL";
                }
            }
        }

        // Contact & Socials
        if (formData.contactEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.contactEmail)) {
                newErrors.contactEmail = "Invalid email format";
            }
        }

        // Speakers
        formData.speakers.forEach((spk, idx) => {
            if (!spk.name.trim()) {
                newErrors[`speaker_${idx}_name`] = "Speaker name is required";
            }
        });

        // FAQs
        formData.faqs.forEach((faq, idx) => {
            if (!faq.question.trim()) {
                newErrors[`faq_${idx}_question`] = "Question is required";
            }
            if (!faq.answer.trim()) {
                newErrors[`faq_${idx}_answer`] = "Answer is required";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Check if tab has errors
    const tabHasError = (tabName) => {
        if (tabName === 'essentials') {
            return !!(errors.title || errors.category || errors.shortDescription || errors.description || errors.bannerImage);
        }
        if (tabName === 'schedule') {
            return !!(errors.startDate || errors.endDate || errors.registrationDeadline || errors.ticketPrice || errors.availableSeats);
        }
        if (tabName === 'location') {
            return !!(errors.city || errors.state || errors.venueName || errors.address || errors.meetingLink);
        }
        if (tabName === 'contacts') {
            return !!errors.contactEmail;
        }
        if (tabName === 'speakers') {
            return Object.keys(errors).some(k => k.startsWith('speaker_') || k.startsWith('faq_'));
        }
        return false;
    };

    // Calculate changed fields delta
    const getChangedFields = () => {
        if (!originalData) return {};
        const changed = {};

        // Scalar fields
        const scalarFields = [
            "title", "shortDescription", "description", "category", "bannerImage", "thumbnailImage",
            "promotionalVideo", "eventMode", "venueName", "address", "city", "state", "country", "pincode",
            "googleMapsLink", "meetingLink", "meetingPassword", "startDate", "endDate", "registrationDeadline",
            "ticketPrice", "availableSeats", "contactEmail", "contactPhone", "website", "refundPolicy",
            "termsAndConditions", "paymentQr", "paymentUPI", "paymentUPTName"
        ];

        scalarFields.forEach(field => {
            if (isFieldLocked(field)) return;

            const originalVal = originalData[field] === undefined || originalData[field] === null ? "" : originalData[field].toString().trim();
            const currentVal = formData[field] === undefined || formData[field] === null ? "" : formData[field].toString().trim();

            if (originalVal !== currentVal) {
                if (field === "ticketPrice") {
                    changed[field] = Number(formData[field]);
                } else if (field === "availableSeats") {
                    changed[field] = formData[field] === "" ? null : Number(formData[field]);
                } else {
                    changed[field] = formData[field];
                }
            }
        });

        // socialLinks nested compare
        const socialFields = ["instagram", "facebook", "linkedin", "twitter", "youtube"];
        let socialLinksChanged = false;
        const changedSocial = {};
        socialFields.forEach(field => {
            const originalVal = (originalData.socialLinks?.[field] || "").trim();
            const currentVal = (formData.socialLinks?.[field] || "").trim();
            if (originalVal !== currentVal) {
                changedSocial[field] = currentVal;
                socialLinksChanged = true;
            }
        });
        if (socialLinksChanged) {
            changed.socialLinks = {
                ...originalData.socialLinks,
                ...changedSocial
            };
        }

        // Speakers array compare
        const origSpeakers = JSON.stringify(originalData.speakers || []);
        const currSpeakers = JSON.stringify(formData.speakers || []);
        if (origSpeakers !== currSpeakers) {
            changed.speakers = formData.speakers;
        }

        // FAQs array compare
        const origFaqs = JSON.stringify(originalData.faqs || []);
        const currFaqs = JSON.stringify(formData.faqs || []);
        if (origFaqs !== currFaqs) {
            changed.faqs = formData.faqs;
        }

        return changed;
    };

    // Save changes without state changes (Keeping current draft/published status)
    const handleSaveChanges = async (e) => {
        e.preventDefault();

        if (isReadOnly) return;

        if (!validateForm()) {
            ToastWarning("Form validation failed. Please check the highlighted fields.");
            return;
        }

        const changedFields = getChangedFields();
        if (Object.keys(changedFields).length === 0) {
            ToastWarning("No modifications were detected to update.");
            return;
        }

        setIsloader(true);
        try {
            const payload = { ...changedFields, _id: eid };
            const res = await updateEventData(payload);
            if (!res.flag) {
                ToastError(res.data?.message || "Failed to update event details.");
                return;
            }
            ToastSuccess(res.data?.message || "Changes saved successfully!");
            navigate("/GoEvent/profile");
        } catch (err) {
            console.error("Save error:", err);
            ToastError("Network error: Could not reach the update server.");
        } finally {
            setIsloader(false);
        }
    };

    // Publish event confirm submission
    const handlePublishEventConfirm = async () => {
        setShowPublishModal(false);
        setIsloader(true);
        try {
            const changedFields = getChangedFields();
            let payload;

            // If user publish event without changing any data, send only status
            if (Object.keys(changedFields).length === 0) {
                payload = { _id: eid, status: "published" };
            } else {
                // If user update data and publish, send corresponding modified data + status
                payload = { ...changedFields, _id: eid, status: "published" };
            }

            const res = await updateEventData(payload);
            if (!res.flag) {
                ToastError(res.data?.message || "Failed to publish event.");
                return;
            }
            ToastSuccess("Event published successfully! Important fields are now locked.");
            navigate("/GoEvent/profile");
        } catch (err) {
            console.error("Publish error:", err);
            ToastError("Network error: Could not reach the publish server.");
        } finally {
            setIsloader(false);
        }
    };

    // Delete event confirm submission
    const handleDeleteEventConfirm = async () => {
        if (currentStatus !== "draft") {
            ToastError("Only draft events can be deleted.");
            return;
        }
        setShowDeleteModal(false);
        setIsloader(true);
        try {
            // Regardless of form changes, deleting sends only the status: "deleted"
            const payload = { _id: eid, status: "deleted" };
            const res = await updateEventData(payload);
            if (!res.flag) {
                ToastError(res.data?.message || "Failed to delete event.");
                return;
            }
            ToastSuccess("Event has been deleted.");
            navigate("/GoEvent/profile");
        } catch (err) {
            console.error("Delete error:", err);
            ToastError("Network error: Could not reach the delete server.");
        } finally {
            setIsloader(false);
        }
    };

    return (
        <div className="update-event-wrapper">
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

            {isLoader && <Loader text="Synchronizing event settings..." />}

            <header className="update-event-hero">
                <div className="update-event-hero-content">
                    <span className="update-tagline">Organizer Hub</span>
                    <h1 className="hero-title">
                        Edit <span className="hero-title-gradient">{formData.title || "Event Details"}</span>
                    </h1>
                    <p className="hero-subtitle">
                        Keep your attendees informed with the latest schedules, virtual connections, or venue location revisions.
                    </p>
                </div>
                <div className="update-event-hero-overlay"></div>
            </header>

            <main className="update-event-main-container">
                {/* Event Status Banner */}
                <div className="update-status-banner">
                    <div className="status-badge-container">
                        <span className="status-badge-label">Event Status:</span>
                        <span className={`status-value-pill ${currentStatus}`}>
                            {currentStatus}
                        </span>
                    </div>
                    {isReadOnly && (
                        <div className="status-warning-note">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            This event is <strong>{currentStatus}</strong> and cannot be modified.
                        </div>
                    )}
                    {(currentStatus === "pending" || currentStatus === "published") && (
                        <div className="status-warning-note">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                            Critical logistics (Capacity, Mode, Payment info) are locked because the event is live.
                        </div>
                    )}
                </div>

                {/* Tabs selection bar */}
                <div className="update-tabs-bar">
                    <button
                        type="button"
                        className={`update-tab-btn ${activeTab === 'essentials' ? 'active' : ''}`}
                        onClick={() => setActiveTab('essentials')}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                        Essentials
                        {tabHasError('essentials') && <span className="update-error-dot">●</span>}
                    </button>
                    <button
                        type="button"
                        className={`update-tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
                        onClick={() => setActiveTab('schedule')}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        Schedule & Price
                        {tabHasError('schedule') && <span className="update-error-dot">●</span>}
                    </button>
                    <button
                        type="button"
                        className={`update-tab-btn ${activeTab === 'location' ? 'active' : ''}`}
                        onClick={() => setActiveTab('location')}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                        </svg>
                        Access & Venue
                        {tabHasError('location') && <span className="update-error-dot">●</span>}
                    </button>
                    <button
                        type="button"
                        className={`update-tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('contacts')}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                        </svg>
                        Contact & Socials
                        {tabHasError('contacts') && <span className="update-error-dot">●</span>}
                    </button>
                    <button
                        type="button"
                        className={`update-tab-btn ${activeTab === 'speakers' ? 'active' : ''}`}
                        onClick={() => setActiveTab('speakers')}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        Speakers & FAQ
                        {tabHasError('speakers') && <span className="update-error-dot">●</span>}
                    </button>
                </div>

                <form className="update-wizard-card" onSubmit={handleSaveChanges}>
                    {/* Essentials Tab */}
                    {activeTab === 'essentials' && (
                        <div className="update-step-pane">
                            <div className="update-step-header">
                                <h3 className="update-step-title">Event Essentials</h3>
                                <p className="update-step-desc">Primary details that establish your event identity.</p>
                            </div>
                            <div className="update-form-grid">
                                <div className="update-form-group update-full-width">
                                    <label className="update-form-label update-label-required" htmlFor="title">
                                        Event Title {renderLockBadge("title")}
                                    </label>
                                    <input
                                        type="text" id="title" name="title"
                                        className={`update-form-input ${errors.title ? 'input-error' : ''}`}
                                        value={formData.title} onChange={handleInputChange}
                                        placeholder="e.g. Techno Beats Carnival"
                                        disabled={isFieldLocked("title")}
                                    />
                                    {errors.title && <span className="update-error-text">{errors.title}</span>}
                                </div>

                                <div className="update-form-group">
                                    <label className="update-form-label update-label-required" htmlFor="category">
                                        Category {renderLockBadge("category")}
                                    </label>
                                    <select
                                        id="category" name="category"
                                        className={`update-form-select ${errors.category ? 'input-error' : ''}`}
                                        value={formData.category} onChange={handleInputChange}
                                        disabled={isFieldLocked("category")}
                                    >
                                        <option value="">-- Choose Category --</option>
                                        {categoriesList.map((cat) => (
                                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {errors.category && <span className="update-error-text">{errors.category}</span>}
                                </div>

                                <div className="update-form-group">
                                    <label className="update-form-label update-label-required" htmlFor="bannerImage">
                                        Banner Image URL {renderLockBadge("bannerImage")}
                                    </label>
                                    <input
                                        type="url" id="bannerImage" name="bannerImage"
                                        className={`update-form-input ${errors.bannerImage ? 'input-error' : ''}`}
                                        value={formData.bannerImage} onChange={handleInputChange}
                                        placeholder="https://example.com/images/banner.jpg"
                                        disabled={isFieldLocked("bannerImage")}
                                    />
                                    {errors.bannerImage && <span className="update-error-text">{errors.bannerImage}</span>}
                                </div>

                                <div className="update-form-group">
                                    <label className="update-form-label" htmlFor="thumbnailImage">
                                        Thumbnail Image URL {renderLockBadge("thumbnailImage")}
                                    </label>
                                    <input
                                        type="url" id="thumbnailImage" name="thumbnailImage" className="update-form-input"
                                        value={formData.thumbnailImage} onChange={handleInputChange}
                                        placeholder="https://example.com/images/thumb.jpg"
                                        disabled={isFieldLocked("thumbnailImage")}
                                    />
                                </div>

                                <div className="update-form-group">
                                    <label className="update-form-label" htmlFor="promotionalVideo">
                                        Promotional Video URL {renderLockBadge("promotionalVideo")}
                                    </label>
                                    <input
                                        type="url" id="promotionalVideo" name="promotionalVideo" className="update-form-input"
                                        value={formData.promotionalVideo} onChange={handleInputChange}
                                        placeholder="YouTube or Vimeo video links"
                                        disabled={isFieldLocked("promotionalVideo")}
                                    />
                                </div>

                                <div className="update-form-group update-full-width">
                                    <label className="update-form-label update-label-required" htmlFor="shortDescription">
                                        Short Summary {renderLockBadge("shortDescription")}
                                    </label>
                                    <input
                                        type="text" id="shortDescription" name="shortDescription"
                                        className={`update-form-input ${errors.shortDescription ? 'input-error' : ''}`}
                                        value={formData.shortDescription} onChange={handleInputChange}
                                        placeholder="A brief tagline summary (max 150 characters)"
                                        disabled={isFieldLocked("shortDescription")}
                                    />
                                    {errors.shortDescription && <span className="update-error-text">{errors.shortDescription}</span>}
                                </div>

                                <div className="update-form-group update-full-width">
                                    <label className="update-form-label update-label-required" htmlFor="description">
                                        Detailed Description {renderLockBadge("description")}
                                    </label>
                                    <textarea
                                        id="description" name="description"
                                        className={`update-form-textarea ${errors.description ? 'input-error' : ''}`}
                                        value={formData.description} onChange={handleInputChange}
                                        placeholder="Event guidelines, outlines, prerequisites, requirements..."
                                        disabled={isFieldLocked("description")}
                                    />
                                    {errors.description && <span className="update-error-text">{errors.description}</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Schedule & Price Tab */}
                    {activeTab === 'schedule' && (
                        <div className="update-step-pane">
                            <div className="update-step-header">
                                <h3 className="update-step-title">Dates & Pricing</h3>
                                <p className="update-step-desc">Establish calendar dates, capacities, and ticket prices.</p>
                            </div>
                            <div className="update-form-grid">
                                <div className="update-form-group">
                                    <label className="update-form-label update-label-required" htmlFor="startDate">
                                        Start Date & Time {renderLockBadge("startDate")}
                                    </label>
                                    <input
                                        type="datetime-local" id="startDate" name="startDate"
                                        className={`update-form-input ${errors.startDate ? 'input-error' : ''}`}
                                        value={formData.startDate} onChange={handleInputChange}
                                        disabled={isFieldLocked("startDate")}
                                    />
                                    {errors.startDate && <span className="update-error-text">{errors.startDate}</span>}
                                </div>

                                <div className="update-form-group">
                                    <label className="update-form-label update-label-required" htmlFor="endDate">
                                        End Date & Time {renderLockBadge("endDate")}
                                    </label>
                                    <input
                                        type="datetime-local" id="endDate" name="endDate"
                                        className={`update-form-input ${errors.endDate ? 'input-error' : ''}`}
                                        value={formData.endDate} onChange={handleInputChange}
                                        disabled={isFieldLocked("endDate")}
                                    />
                                    {errors.endDate && <span className="update-error-text">{errors.endDate}</span>}
                                </div>

                                <div className="update-form-group">
                                    <label className="update-form-label" htmlFor="registrationDeadline">
                                        Registration Deadline {renderLockBadge("registrationDeadline")}
                                    </label>
                                    <input
                                        type="datetime-local" id="registrationDeadline" name="registrationDeadline"
                                        className={`update-form-input ${errors.registrationDeadline ? 'input-error' : ''}`}
                                        value={formData.registrationDeadline} onChange={handleInputChange}
                                        disabled={isFieldLocked("registrationDeadline")}
                                    />
                                    {errors.registrationDeadline && <span className="update-error-text">{errors.registrationDeadline}</span>}
                                </div>

                                <div className="update-form-group">
                                    <label className="update-form-label" htmlFor="ticketPrice">
                                        Ticket Price (₹) {renderLockBadge("ticketPrice")}
                                    </label>
                                    <input
                                        type="number" id="ticketPrice" name="ticketPrice"
                                        className={`update-form-input ${errors.ticketPrice ? 'input-error' : ''}`}
                                        value={formData.ticketPrice} onChange={handleInputChange}
                                        placeholder="0 for Free entry" min="0"
                                        disabled={isFieldLocked("ticketPrice")}
                                    />
                                    {errors.ticketPrice && <span className="update-error-text">{errors.ticketPrice}</span>}
                                </div>

                                <div className="update-form-group">
                                    <label className="update-form-label" htmlFor="availableSeats">
                                        Available Seats Capacity {renderLockBadge("availableSeats")}
                                    </label>
                                    <input
                                        type="number" id="availableSeats" name="availableSeats"
                                        className={`update-form-input ${errors.availableSeats ? 'input-error' : ''}`}
                                        value={formData.availableSeats} onChange={handleInputChange}
                                        placeholder="e.g. 500 (blank for unlimited)" min="1"
                                        disabled={isFieldLocked("availableSeats")}
                                    />
                                    {errors.availableSeats && <span className="update-error-text">{errors.availableSeats}</span>}
                                </div>

                                <div className="update-form-group">
                                    <label className="update-form-label" htmlFor="paymentUPI">
                                        Merchant UPI ID {renderLockBadge("paymentUPI")}
                                    </label>
                                    <input
                                        type="text" id="paymentUPI" name="paymentUPI" className="update-form-input"
                                        value={formData.paymentUPI} onChange={handleInputChange}
                                        placeholder="e.g. merchant@paytm"
                                        disabled={isFieldLocked("paymentUPI")}
                                    />
                                </div>

                                <div className="update-form-group">
                                    <label className="update-form-label" htmlFor="paymentUPTName">
                                        Merchant UPI Name {renderLockBadge("paymentUPTName")}
                                    </label>
                                    <input
                                        type="text" id="paymentUPTName" name="paymentUPTName" className="update-form-input"
                                        value={formData.paymentUPTName} onChange={handleInputChange}
                                        placeholder="e.g. GoEvent Studios"
                                        disabled={isFieldLocked("paymentUPTName")}
                                    />
                                </div>

                                <div className="update-form-group">
                                    <label className="update-form-label" htmlFor="paymentQr">
                                        QR Payment Image Link {renderLockBadge("paymentQr")}
                                    </label>
                                    <input
                                        type="url" id="paymentQr" name="paymentQr" className="update-form-input"
                                        value={formData.paymentQr} onChange={handleInputChange}
                                        placeholder="https://example.com/qr.jpg"
                                        disabled={isFieldLocked("paymentQr")}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Access & Venue Tab */}
                    {activeTab === 'location' && (
                        <div className="update-step-pane">
                            <div className="update-step-header">
                                <h3 className="update-step-title">Access & Location</h3>
                                <p className="update-step-desc">Set venue location information or online access coordinates.</p>
                            </div>

                            <div className="update-form-group update-full-width" style={{ marginBottom: '1.5rem' }}>
                                <label className="update-form-label">
                                    Select Event Mode {renderLockBadge("eventMode")}
                                </label>
                                <div className="update-mode-container">
                                    <div
                                        className={`update-mode-card ${formData.eventMode === 'offline' ? 'selected' : ''} ${isFieldLocked("eventMode") ? 'disabled' : ''}`}
                                        onClick={() => !isFieldLocked("eventMode") && setFormData(prev => ({ ...prev, eventMode: 'offline' }))}
                                    >
                                        <div className="update-mode-icon">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                                            </svg>
                                        </div>
                                        <div className="update-mode-details">
                                            <h4>Physical Venue</h4>
                                            <p>Concerts, local workshops, conferences</p>
                                        </div>
                                    </div>

                                    <div
                                        className={`update-mode-card ${formData.eventMode === 'online' ? 'selected' : ''} ${isFieldLocked("eventMode") ? 'disabled' : ''}`}
                                        onClick={() => !isFieldLocked("eventMode") && setFormData(prev => ({ ...prev, eventMode: 'online' }))}
                                    >
                                        <div className="update-mode-icon">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
                                            </svg>
                                        </div>
                                        <div className="update-mode-details">
                                            <h4>Online / Virtual</h4>
                                            <p>Webinars, Zoom links, stream key codes</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="update-form-grid">
                                {formData.eventMode === 'offline' ? (
                                    <>
                                        <div className="update-form-group update-full-width">
                                            <label className="update-form-label update-label-required" htmlFor="venueName">
                                                Venue Name {renderLockBadge("venueName")}
                                            </label>
                                            <input
                                                type="text" id="venueName" name="venueName"
                                                className={`update-form-input ${errors.venueName ? 'input-error' : ''}`}
                                                value={formData.venueName} onChange={handleInputChange}
                                                placeholder="e.g. Science Auditorium Hall C"
                                                disabled={isFieldLocked("venueName")}
                                            />
                                            {errors.venueName && <span className="update-error-text">{errors.venueName}</span>}
                                        </div>
                                        <div className="update-form-group update-full-width">
                                            <label className="update-form-label update-label-required" htmlFor="address">
                                                Street Address {renderLockBadge("address")}
                                            </label>
                                            <input
                                                type="text" id="address" name="address"
                                                className={`update-form-input ${errors.address ? 'input-error' : ''}`}
                                                value={formData.address} onChange={handleInputChange}
                                                placeholder="e.g. Outer Ring Road, Sector 5"
                                                disabled={isFieldLocked("address")}
                                            />
                                            {errors.address && <span className="update-error-text">{errors.address}</span>}
                                        </div>
                                        <div className="update-form-group">
                                            <label className="update-form-label" htmlFor="pincode">
                                                Pincode / ZIP Code {renderLockBadge("pincode")}
                                            </label>
                                            <input
                                                type="text" id="pincode" name="pincode" className="update-form-input"
                                                value={formData.pincode} onChange={handleInputChange}
                                                placeholder="e.g. 400001"
                                                disabled={isFieldLocked("pincode")}
                                            />
                                        </div>
                                        <div className="update-form-group">
                                            <label className="update-form-label" htmlFor="googleMapsLink">
                                                Google Maps Link {renderLockBadge("googleMapsLink")}
                                            </label>
                                            <input
                                                type="url" id="googleMapsLink" name="googleMapsLink" className="update-form-input"
                                                value={formData.googleMapsLink} onChange={handleInputChange}
                                                placeholder="https://maps.google.com/..."
                                                disabled={isFieldLocked("googleMapsLink")}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="update-form-group update-full-width">
                                            <label className="update-form-label update-label-required" htmlFor="meetingLink">
                                                Meeting URL / Webinar Link {renderLockBadge("meetingLink")}
                                            </label>
                                            <input
                                                type="url" id="meetingLink" name="meetingLink"
                                                className={`update-form-input ${errors.meetingLink ? 'input-error' : ''}`}
                                                value={formData.meetingLink} onChange={handleInputChange}
                                                placeholder="Zoom, Google Meet, Teams, Youtube stream"
                                                disabled={isFieldLocked("meetingLink")}
                                            />
                                            {errors.meetingLink && <span className="update-error-text">{errors.meetingLink}</span>}
                                        </div>
                                        <div className="update-form-group update-full-width">
                                            <label className="update-form-label" htmlFor="meetingPassword">
                                                Meeting Password / Access Codes {renderLockBadge("meetingPassword")}
                                            </label>
                                            <input
                                                type="text" id="meetingPassword" name="meetingPassword" className="update-form-input"
                                                value={formData.meetingPassword} onChange={handleInputChange}
                                                placeholder="Access passcode if required"
                                                disabled={isFieldLocked("meetingPassword")}
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="update-form-group">
                                    <label className="update-form-label update-label-required" htmlFor="city">
                                        City {renderLockBadge("city")}
                                    </label>
                                    <input
                                        type="text" id="city" name="city"
                                        className={`update-form-input ${errors.city ? 'input-error' : ''}`}
                                        value={formData.city} onChange={handleInputChange}
                                        placeholder="e.g. Mumbai"
                                        disabled={isFieldLocked("city")}
                                    />
                                    {errors.city && <span className="update-error-text">{errors.city}</span>}
                                </div>

                                <div className="update-form-group">
                                    <label className="update-form-label update-label-required" htmlFor="state">
                                        State {renderLockBadge("state")}
                                    </label>
                                    <input
                                        type="text" id="state" name="state"
                                        className={`update-form-input ${errors.state ? 'input-error' : ''}`}
                                        value={formData.state} onChange={handleInputChange}
                                        placeholder="e.g. Maharashtra"
                                        disabled={isFieldLocked("state")}
                                    />
                                    {errors.state && <span className="update-error-text">{errors.state}</span>}
                                </div>

                                <div className="update-form-group">
                                    <label className="update-form-label" htmlFor="country">
                                        Country {renderLockBadge("country")}
                                    </label>
                                    <input
                                        type="text" id="country" name="country" className="update-form-input"
                                        value={formData.country} onChange={handleInputChange}
                                        disabled={isFieldLocked("country")}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contact & Socials Tab */}
                    {activeTab === 'contacts' && (
                        <div className="update-step-pane">
                            <div className="update-step-header">
                                <h3 className="update-step-title">Contact & Social Links</h3>
                                <p className="update-step-desc">Tell attendees how to reach out and where to follow updates.</p>
                            </div>
                            <div className="update-form-grid">
                                <div className="update-form-group">
                                    <label className="update-form-label" htmlFor="contactEmail">
                                        Contact Email {renderLockBadge("contactEmail")}
                                    </label>
                                    <input
                                        type="email" id="contactEmail" name="contactEmail"
                                        className={`update-form-input ${errors.contactEmail ? 'input-error' : ''}`}
                                        value={formData.contactEmail} onChange={handleInputChange}
                                        placeholder="e.g. support@company.com"
                                        disabled={isFieldLocked("contactEmail")}
                                    />
                                    {errors.contactEmail && <span className="update-error-text">{errors.contactEmail}</span>}
                                </div>

                                <div className="update-form-group">
                                    <label className="update-form-label" htmlFor="contactPhone">
                                        Contact Phone {renderLockBadge("contactPhone")}
                                    </label>
                                    <input
                                        type="tel" id="contactPhone" name="contactPhone" className="update-form-input"
                                        value={formData.contactPhone} onChange={handleInputChange}
                                        placeholder="e.g. +91 9988776655"
                                        disabled={isFieldLocked("contactPhone")}
                                    />
                                </div>

                                <div className="update-form-group update-full-width">
                                    <label className="update-form-label" htmlFor="website">
                                        Official Event Website {renderLockBadge("website")}
                                    </label>
                                    <input
                                        type="url" id="website" name="website" className="update-form-input"
                                        value={formData.website} onChange={handleInputChange}
                                        placeholder="https://company.com/event"
                                        disabled={isFieldLocked("website")}
                                    />
                                </div>

                                <div className="update-form-group">
                                    <label className="update-form-label" htmlFor="instagram">
                                        Instagram Username {renderLockBadge("socialLinks")}
                                    </label>
                                    <input
                                        type="text" id="instagram" name="instagram" className="update-form-input"
                                        value={formData.socialLinks.instagram} onChange={handleSocialChange}
                                        placeholder="@username"
                                        disabled={isReadOnly}
                                    />
                                </div>

                                <div className="update-form-group">
                                    <label className="update-form-label" htmlFor="linkedin">
                                        LinkedIn Page URL {renderLockBadge("socialLinks")}
                                    </label>
                                    <input
                                        type="text" id="linkedin" name="linkedin" className="update-form-input"
                                        value={formData.socialLinks.linkedin} onChange={handleSocialChange}
                                        placeholder="https://linkedin.com/company/..."
                                        disabled={isReadOnly}
                                    />
                                </div>

                                <div className="update-form-group">
                                    <label className="update-form-label" htmlFor="facebook">
                                        Facebook Page URL {renderLockBadge("socialLinks")}
                                    </label>
                                    <input
                                        type="text" id="facebook" name="facebook" className="update-form-input"
                                        value={formData.socialLinks.facebook} onChange={handleSocialChange}
                                        placeholder="https://facebook.com/..."
                                        disabled={isReadOnly}
                                    />
                                </div>

                                <div className="update-form-group">
                                    <label className="update-form-label" htmlFor="twitter">
                                        Twitter / X Handle {renderLockBadge("socialLinks")}
                                    </label>
                                    <input
                                        type="text" id="twitter" name="twitter" className="update-form-input"
                                        value={formData.socialLinks.twitter} onChange={handleSocialChange}
                                        placeholder="@handle"
                                        disabled={isReadOnly}
                                    />
                                </div>

                                <div className="update-form-group">
                                    <label className="update-form-label" htmlFor="youtube">
                                        YouTube Channel URL {renderLockBadge("socialLinks")}
                                    </label>
                                    <input
                                        type="text" id="youtube" name="youtube" className="update-form-input"
                                        value={formData.socialLinks.youtube} onChange={handleSocialChange}
                                        placeholder="https://youtube.com/@channel"
                                        disabled={isReadOnly}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Speakers & FAQs Tab */}
                    {activeTab === 'speakers' && (
                        <div className="update-step-pane">
                            <div className="update-step-header">
                                <h3 className="update-step-title">Speakers & FAQs</h3>
                                <p className="update-step-desc">Establish program speakers, FAQs, and refund/cancellation guidelines.</p>
                            </div>

                            {/* Speakers Repeater */}
                            <div style={{ marginBottom: '2.5rem' }}>
                                <h4 style={{ margin: '0 0 1rem 0', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Event Speakers {renderLockBadge("speakers")}
                                </h4>
                                <div className="update-repeater-container">
                                    {formData.speakers.map((spk, idx) => (
                                        <div key={idx} className="update-repeater-item">
                                            {!isReadOnly && (
                                                <button
                                                    type="button" className="update-remove-btn"
                                                    onClick={() => removeSpeaker(idx)}
                                                    disabled={isReadOnly}
                                                >
                                                    &times;
                                                </button>
                                            )}
                                            <div className="update-form-grid">
                                                <div className="update-form-group">
                                                    <label className="update-form-label update-label-required">Speaker Name</label>
                                                    <input
                                                        type="text"
                                                        className={`update-form-input ${errors[`speaker_${idx}_name`] ? 'input-error' : ''}`}
                                                        value={spk.name} onChange={(e) => handleSpeakerChange(idx, 'name', e.target.value)}
                                                        placeholder="Full name"
                                                        disabled={isReadOnly}
                                                    />
                                                    {errors[`speaker_${idx}_name`] && <span className="update-error-text">{errors[`speaker_${idx}_name`]}</span>}
                                                </div>

                                                <div className="update-form-group">
                                                    <label className="update-form-label">Designation / Role</label>
                                                    <input
                                                        type="text" className="update-form-input"
                                                        value={spk.designation} onChange={(e) => handleSpeakerChange(idx, 'designation', e.target.value)}
                                                        placeholder="e.g. Chief Technical Officer"
                                                        disabled={isReadOnly}
                                                    />
                                                </div>

                                                <div className="update-form-group">
                                                    <label className="update-form-label">Company / Affiliation</label>
                                                    <input
                                                        type="text" className="update-form-input"
                                                        value={spk.company} onChange={(e) => handleSpeakerChange(idx, 'company', e.target.value)}
                                                        placeholder="e.g. Google India"
                                                        disabled={isReadOnly}
                                                    />
                                                </div>

                                                <div className="update-form-group">
                                                    <label className="update-form-label">Photo Image Link</label>
                                                    <input
                                                        type="url" className="update-form-input"
                                                        value={spk.image} onChange={(e) => handleSpeakerChange(idx, 'image', e.target.value)}
                                                        placeholder="https://example.com/avatar.jpg"
                                                        disabled={isReadOnly}
                                                    />
                                                </div>

                                                <div className="update-form-group update-full-width">
                                                    <label className="update-form-label">Biography</label>
                                                    <textarea
                                                        className="update-form-textarea" style={{ minHeight: '80px' }}
                                                        value={spk.bio} onChange={(e) => handleSpeakerChange(idx, 'bio', e.target.value)}
                                                        placeholder="Short speaker background summary..."
                                                        disabled={isReadOnly}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {!isReadOnly && (
                                        <button
                                            type="button" className="update-add-btn"
                                            onClick={addSpeaker}
                                            disabled={isReadOnly}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                            </svg>
                                            Add Speaker
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* FAQs Repeater */}
                            <div style={{ marginBottom: '2.5rem' }}>
                                <h4 style={{ margin: '0 0 1rem 0', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Frequently Asked Questions {renderLockBadge("faqs")}
                                </h4>
                                <div className="update-repeater-container">
                                    {formData.faqs.map((faq, idx) => (
                                        <div key={idx} className="update-repeater-item">
                                            {!isReadOnly && (
                                                <button
                                                    type="button" className="update-remove-btn"
                                                    onClick={() => removeFaq(idx)}
                                                    disabled={isReadOnly}
                                                >
                                                    &times;
                                                </button>
                                            )}
                                            <div className="update-form-grid">
                                                <div className="update-form-group update-full-width">
                                                    <label className="update-form-label update-label-required">Question</label>
                                                    <input
                                                        type="text"
                                                        className={`update-form-input ${errors[`faq_${idx}_question`] ? 'input-error' : ''}`}
                                                        value={faq.question} onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                                                        placeholder="e.g. Is parking available at the venue?"
                                                        disabled={isReadOnly}
                                                    />
                                                    {errors[`faq_${idx}_question`] && <span className="update-error-text">{errors[`faq_${idx}_question`]}</span>}
                                                </div>

                                                <div className="update-form-group update-full-width">
                                                    <label className="update-form-label update-label-required">Answer</label>
                                                    <textarea
                                                        className={`update-form-textarea ${errors[`faq_${idx}_answer`] ? 'input-error' : ''}`}
                                                        style={{ minHeight: '80px' }}
                                                        value={faq.answer} onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                                                        placeholder="Write a clear response..."
                                                        disabled={isReadOnly}
                                                    />
                                                    {errors[`faq_${idx}_answer`] && <span className="update-error-text">{errors[`faq_${idx}_answer`]}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {!isReadOnly && (
                                        <button
                                            type="button" className="update-add-btn"
                                            onClick={addFaq}
                                            disabled={isReadOnly}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                            </svg>
                                            Add FAQ
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Policies (Refund & T&C) */}
                            <div className="update-form-grid">
                                <div className="update-form-group update-full-width">
                                    <label className="update-form-label" htmlFor="refundPolicy">
                                        Refund / Cancellation Policy {renderLockBadge("refundPolicy")}
                                    </label>
                                    <textarea
                                        id="refundPolicy" name="refundPolicy" className="update-form-textarea"
                                        value={formData.refundPolicy} onChange={handleInputChange}
                                        placeholder="e.g. Refundable up to 24 hours prior to starting date..."
                                        disabled={isFieldLocked("refundPolicy")}
                                    />
                                </div>

                                <div className="update-form-group update-full-width">
                                    <label className="update-form-label" htmlFor="termsAndConditions">
                                        Terms & Conditions {renderLockBadge("termsAndConditions")}
                                    </label>
                                    <textarea
                                        id="termsAndConditions" name="termsAndConditions" className="update-form-textarea"
                                        value={formData.termsAndConditions} onChange={handleInputChange}
                                        placeholder="Required guidelines, legal notices, safety rules..."
                                        disabled={isFieldLocked("termsAndConditions")}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions Bar */}
                    <div className="update-form-actions">
                        <div>
                            {currentStatus === "draft" && (
                                <button
                                    type="button" className="update-btn-danger"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    </svg>
                                    Delete Event
                                </button>
                            )}
                        </div>
                        <div className="actions-right">
                            <button
                                type="button" className="update-btn-secondary"
                                onClick={() => navigate("/GoEvent/profile")}
                            >
                                {isReadOnly ? "Back to Profile" : "Cancel"}
                            </button>
                            {!isReadOnly && (
                                <>
                                    <button
                                        type="submit" className="update-btn-primary"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
                                        </svg>
                                        Save Changes
                                    </button>
                                    {(currentStatus === "draft" || currentStatus === "pending") && (
                                        <button
                                            type="button" className="update-btn-publish"
                                            onClick={() => {
                                                if (validateForm()) {
                                                    setShowPublishModal(true);
                                                } else {
                                                    ToastWarning("Form validation failed. Please correct error fields before publishing.");
                                                }
                                            }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <polygon points="5 3 19 12 5 21 5 3" />
                                            </svg>
                                            Publish Event
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </form>
            </main>

            {/* PUBLISH CONFIRMATION OVERLAY MODAL */}
            {showPublishModal && (
                <div className="modal-backdrop-overlay" onClick={() => setShowPublishModal(false)}>
                    <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-section">
                            <div className="modal-icon-badge warning">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                            </div>
                            <h4 className="modal-dialog-title">Publish Event</h4>
                        </div>
                        <p className="modal-dialog-desc">
                            Are you sure you want to publish this event? Once live, critical billing and logistics configuration values will be locked to protect ticket buyers.
                        </p>
                        <div className="modal-locked-fields-list">
                            <h5>Fields that can't be changed after publishing:</h5>
                            <ul>
                                <li>Event Mode (Online / Physical Venue)</li>
                                <li>Available Seats Capacity</li>
                                <li>UPI Merchant ID & Merchant Name</li>
                                <li>Payment QR Code Image Link</li>
                            </ul>
                        </div>
                        <div className="modal-dialog-actions">
                            <button
                                type="button" className="update-btn-secondary"
                                onClick={() => setShowPublishModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button" className="update-btn-publish"
                                onClick={handlePublishEventConfirm}
                            >
                                Confirm & Publish
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION OVERLAY MODAL */}
            {showDeleteModal && (
                <div className="modal-backdrop-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-section">
                            <div className="modal-icon-badge danger">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h4 className="modal-dialog-title">Delete Event</h4>
                        </div>
                        <p className="modal-dialog-desc">
                            Are you sure you want to delete this event? This will mark the status as "deleted" and prevent further ticket bookings or updates. This action is irreversible.
                        </p>
                        <div className="modal-dialog-actions">
                            <button
                                type="button" className="update-btn-secondary"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button" className="update-btn-danger"
                                onClick={handleDeleteEventConfirm}
                                style={{ background: '#ef4444', color: '#ffffff', borderColor: '#ef4444' }}
                            >
                                Confirm & Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};