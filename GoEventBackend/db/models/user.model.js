const mongoose = require("mongoose");

const USER = new mongoose.Schema({
    name: {
        type: String,
        required: true
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
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 10
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
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