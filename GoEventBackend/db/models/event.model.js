const mongoose = require("mongoose");

const EVENT = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    shortDescription: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    // Organizer
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    organizerName: String,
    // Media
    bannerImage: {
        type: String,
        required: true
    },
    thumbnailImage: String,
    galleryImages: [String],
    promotionalVideo: String,
    // Event Type
    eventMode: {
        type: String,
        required: true
    },
    // Location
    venueName: String,
    address: String,
    city: {
        type: String,
        index: true
    },
    state: {
        type: String,
    },
    country: {
        type: String,
        default: "India"
    },
    pincode: String,
    googleMapsLink: String,
    // Online Event
    meetingLink: String,
    meetingPassword: String,

    // Dates
    startDate: {
        type: Date,
        required: true,
        index: true
    },
    endDate: {
        type: Date,
        required: true
    },
    registrationDeadline: Date,

    ticketPrice: {
        type: Number,
        default: 0
    },
    availableSeats: {
        type: Number,
        default: 0
    },
    seatsFilled: {
        type: Number,
        defalt: 0
    },
    registrationCount: {
        type: Number,
        default: 0
    },
    // Contact
    contactEmail: String,
    contactPhone: String,
    website: String,

    // Social Links
    socialLinks: {
        instagram: String,
        facebook: String,
        linkedin: String,
        twitter: String,
        youtube: String
    },
    // Speakers
    speakers: [
        {
            name: String,
            designation: String,
            company: String,
            image: String,
            bio: String
        }
    ],
    // FAQ
    faqs: [
        {
            question: String,
            answer: String
        }
    ],
    // Policies
    refundPolicy: String,
    termsAndConditions: String,
    likes: {
        type: Number,
        default: 0
    },
    comments: [
        {
            name: String,
            email: String,
            comment: String
        }
    ],
    // Status
    status: {
        type: String,
        enum: [
            "draft",
            "pending",
            "published",
            "completed",
            "cancelled",
            "deleted"
        ],
        default: "draft",
        index: true
    },
    paymentQr: {
        type: String,
        default: ""
    },
    paymentUPI: {
        type: String,
        default: ""
    },
    paymentUPTName: {
        type: String,
        default: ""
    },
    // other 
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

});

// Text Search
EVENT.index({
    title: "text",
    shortDescription: "text",
    description: "text",
    tags: "text"
});

// Geo Search
EVENT.index({
    location: "2dsphere"
});

// Homepage Events
EVENT.index({
    status: 1,
    isFeatured: 1,
    startDate: 1
});

// Organizer Dashboard
EVENT.index({
    organizer: 1,
    createdAt: -1
});

// Category Search
EVENT.index({
    category: 1,
    city: 1
});

// Upcoming Events
EVENT.index({
    startDate: 1,
    status: 1
});

// Popular Events
EVENT.index({
    views: -1,
    registrationCount: -1
});

// Slug Lookup
EVENT.index({
    slug: 1
});

// City Search
EVENT.index({
    city: 1,
    state: 1
});

const Event = mongoose.model("Event", EVENT);

module.exports = Event;