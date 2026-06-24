// ------------------------- requiring packages ------------------------- //
const express = require("express");

// ------------------------- requiring handlers ------------------------- //
const {GetLandingEvents} = require("../handlers/event.handler.js");

// ------------------------- initialize router ------------------------- //
const Router = express.Router();

Router.route("/get").get((req, res) => {
    res.send("Get router");
});

Router.route("/get/get-land-events").get(GetLandingEvents);

module.exports = Router;