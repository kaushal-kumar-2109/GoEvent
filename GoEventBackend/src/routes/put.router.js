// ------------------------- requiring packages ------------------------- //
const express = require("express");

// ------------------------- requiring handlers ------------------------- //
const { UpdatePassword } = require("../handlers/user.handler.js");
const { CheckUserValidation } = require("../middlewares/checkValidation.js");

// ------------------------- initialize router ------------------------- //
const Router = express.Router();

Router.route("/put").post((req, res) => {
    res.send("Put router");
});

Router.route("/put/change-password").post(CheckUserValidation, UpdatePassword);

module.exports = Router;