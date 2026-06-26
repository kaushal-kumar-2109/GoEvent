const mongoose = require("mongoose");

const OTP = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        otp: {
            type: String,
            required: true,
        },

        // Number of failed verification attempts
        attempts: {
            type: Number,
            default: 3,
            min: 0,
            max: 3,
        },

        // OTP expiry time (10 minutes)
        exp: {
            type: Date,
            default: () => new Date(Date.now() + 10 * 60 * 1000),
            expires: 0, // Automatically delete after 'exp' time
        },
    },
    {
        timestamps: true,
    }
);

const Otp = mongoose.model("Otp", OTP);

module.exports = Otp;