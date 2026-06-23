const mongoose = require("mongoose");

const OTP = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    exp: {
        type: Date,
        default: Date.now() + 10 * 60 * 1000
    }
})

const Otp = mongoose.model("Otp", OTP);

module.exports = Otp;