// ------------------------- Package requiring ------------------------- 
const express = require('express');
const Token = require("../models/token.model.js");
const { GetLandingEventsHandler, GetEventsHandler, GetEventDetailsHandler } = require('../handlers/event.handler');
const { CheckUserAuth } = require('../middleware/auth.midleware');
const { SendUserData } = require('../handlers/user.handler');

const ROUTER = express.Router();

// ------------------------- routers ------------------------- //
ROUTER.route("/get-user").get(CheckUserAuth, SendUserData);
ROUTER.route("/get-landing-events").get(GetLandingEventsHandler);
ROUTER.route("/get-events").get(GetEventsHandler);
ROUTER.route("/get-event-details/:eid").get(GetEventDetailsHandler);

ROUTER.route("/user-log-out").get(async (req, res) => {
    try {
        const { GoEventUserToken } = req.cookies;
        if (!GoEventUserToken) return res.status(400).json({ tag: "token", status: 400, success: false, message: "Token not found" });
        await Token.deleteOne({ token: GoEventUserToken });
        res.clearCookie("GoEventUserToken");
        return res.status(200).json({ tag: "token", status: 200, success: true, message: "User log out successfully!" });

    } catch (err) {
        console.error("user log out Error:", err);
        return res.status(500).json({
            tag: "server",
            status: 500,
            success: false,
            message: "Internal server error!",
            error: err.message
        });
    }
});

module.exports = ROUTER;