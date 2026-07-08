const mongoose = require("mongoose");

const Booking = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    seats: {
        type: Number,
        required: true
    },
    transectionName: {
        type: String,
        required: true
    },
    transectionId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING", "CONFIRMED", "CANCELLED"],
        default: "PENDING"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Booking", Booking);