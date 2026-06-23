const mongoose = require("mongoose");

const TOKEN = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: "7d" // 👈 Automatically deletes 7 days after createdAt
    }
});

const Token = mongoose.model("Token", TOKEN);

module.exports = Token;