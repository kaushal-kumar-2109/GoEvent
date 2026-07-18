// ------------------------- Package requiring ------------------------- 
const express = require('express');
const { CheckUserAuth } = require('../middleware/auth.midleware');
const { UserEmailVerificationHandler, UserOtpVerifyCreateUserHandler } = require('../handlers/user.handler');

const ROUTER = express.Router();

// ------------------------- routers ------------------------- //
// ROUTER.route("/get-user").post(CheckUserAuth, GetUserDataHandler);
ROUTER.route("/send-otp").post(UserEmailVerificationHandler);
ROUTER.route("/register-user").post(UserOtpVerifyCreateUserHandler);

module.exports = ROUTER;