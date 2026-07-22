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
    eventType: {
        type: String,
        enum: ["PUBLIC", "PRIVATE", "ALL"],
        default: "ALL"
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
    availableSeats: { // number of seats left
        type: Number,
        default: 0
    },
    seatsFilled: {  // number of booking count
        type: Number,
        defalt: 0
    },
    totalSeats: { // total number of seates
        type: Number,
        default: 0
    },
    // Contact
    contactEmail: String,
    contactPhone: String,
    website: {
        type: String,
        default: ""
    },
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
    schedule: [
        {
            time: {
                type: String,
                required: true
            },
            event: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            }
        }
    ],
    // Status
    status: {
        type: String,
        enum: [
            "DRAFT",
            "PUBLISHED",
            "PENDING",
            "STARTED",
            "COMPLETED",
            "CANCELLED",
            "DELETED"
        ],
        default: "DRAFT",
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
    paymentUPIName: {
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