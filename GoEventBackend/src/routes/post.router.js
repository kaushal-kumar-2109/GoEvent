// ------------------------- requiring packages ------------------------- //
const express = require("express");

// ------------------------- initialize router ------------------------- //
const Router = express.Router();

// ------------------------- user handeler ------------------------- //
const { CreateUser, SetUser, SendEmailOTP } = require("../handlers/user.handler.js");

// ------------------------- creating routes ------------------------- //
Router.route("/post").post((req, res) => {
    res.send("Post router");
});

Router.route("/post/create-user").post(CreateUser);
Router.route("/post/set-user").post(SetUser);
Router.route("/post/send-otp").post(SendEmailOTP);

module.exports = Router;