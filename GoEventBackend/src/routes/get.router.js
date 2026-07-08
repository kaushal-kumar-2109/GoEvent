// ------------------------- requiring packages ------------------------- //
const express = require("express");

// ------------------------- requiring handlers ------------------------- //
const { GetLandingEvents, GetEventById, GetAllEvents } = require("../handlers/event.handler.js");
const { CheckUserAuth } = require("../middlewares/checkAuth.js");
const { GetUserProfileData } = require("../handlers/user.handler.js");

// ------------------------- initialize router ------------------------- //
const Router = express.Router();

Router.route("/get").get((req, res) => {
    res.send("Get router");
});

Router.route("/get/get-land-events").get(GetLandingEvents);
Router.route("/get/get-event/:id").get(GetEventById);
Router.route("/get/get-events").get(GetAllEvents);
Router.route("/get/get-user-profile-data").get(CheckUserAuth, GetUserProfileData);

module.exports = Router;