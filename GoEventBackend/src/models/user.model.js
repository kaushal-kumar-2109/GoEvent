const mongoose = require("mongoose");

const USER = new mongoose.Schema({
    // --- personal details
    name: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    phone: {
        type: String,
        minlength: 10,
        maxlength: 10
    },
    // --- profile details
    role: {
        type: String,
        enum: ["USER", "HOST", "ADMIN"],
        default: "USER"
    },
    organisation: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE", "DELETED", "LOCKED"],
        default: "ACTIVE"
    },
    bio: {
        type: String,
        default: ""
    },
    // --- settings details
    avatar: {
        type: Number,
        default: 0,
    },
    theam: {
        type: String,
        enum: ["LIGHT", "DARK", "SYSTEM"],
        default: "LIGHT"
    },
    emailNotification: {
        type: Boolean,
        default: true
    },
    pushNotification: {
        type: Boolean,
        default: true
    },
    // --- system details
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    attempts: {
        type: Number,
        default: 3
    },
    lockedUntil: {
        type: Date,
        default: null
    }
});

const User = mongoose.model("User", USER);

module.exports = User;