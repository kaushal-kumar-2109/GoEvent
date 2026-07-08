// ------------------------- requiring packages ------------------------- //
const express = require("express");

// ------------------------- requiring handlers ------------------------- //
const { UpdatePassword } = require("../handlers/user.handler.js");
const { CheckUserValidation } = require("../middlewares/checkValidation.js");
const { updateEventData } = require("../handlers/event.handler.js");
const { CheckUserAuth } = require("../middlewares/checkAuth.js");

// ------------------------- initialize router ------------------------- //
const Router = express.Router();

Router.route("/put").post((req, res) => {
    res.send("Put router");
});

Router.route("/put/change-password").post(CheckUserValidation, UpdatePassword);
Router.route("/put/update-event").post(CheckUserAuth, updateEventData);

module.exports = Router;