const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const BookingSchema = new mongoose.Schema({
    refId: {
        type: String,
        default: uuidv4
    },
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
    attenders: [
        {
            ticketId: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            age: {
                type: Number,
                required: true
            }
        }
    ],
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

const Booking = mongoose.model("Booking", BookingSchema);
module.exports = Booking;
