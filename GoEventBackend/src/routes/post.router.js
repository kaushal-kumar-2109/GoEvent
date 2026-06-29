// ------------------------- requiring packages ------------------------- //
const express = require("express");

// ------------------------- initialize router ------------------------- //
const Router = express.Router();

// ------------------------- user handeler ------------------------- //
const { CreateUser, SetUser, SendEmailOTP } = require("../handlers/user.handler.js");
const { CreateEvent } = require("../handlers/event.handler.js");
const { CheckUserValidation } = require("../middlewares/checkValidation.js");
const { CheckUserAuth } = require("../middlewares/checkAuth.js");

// ------------------------- creating routes ------------------------- //
Router.route("/post").post((req, res) => {
    res.send("Post router");
});

Router.route("/post/create-user").post(CreateUser);
Router.route("/post/set-user").post(CheckUserValidation, SetUser);
Router.route("/post/send-otp").post(SendEmailOTP);

Router.route("/post/create-event").post(CheckUserAuth, CreateEvent);

module.exports = Router;