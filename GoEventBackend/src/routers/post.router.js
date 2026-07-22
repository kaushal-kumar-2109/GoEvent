// ------------------------- Package requiring ------------------------- 
const express = require('express');
const { CheckUserAuth } = require('../middleware/auth.midleware');
const { UserEmailVerificationHandler, UserOtpVerifyCreateUserHandler, SetUserLoginHandler } = require('../handlers/user.handler');
const { CreateEventHandler, UploadImageHandler } = require('../handlers/event.handler');
const upload = require('../middleware/upload.middleware');

const ROUTER = express.Router();

// ------------------------- routers ------------------------- //
// ROUTER.route("/get-user").post(CheckUserAuth, GetUserDataHandler);
ROUTER.route("/send-otp").post(UserEmailVerificationHandler);
ROUTER.route("/register-user").post(UserOtpVerifyCreateUserHandler);
ROUTER.route("/user-login").post(SetUserLoginHandler);

ROUTER.route("/create-event").post(CheckUserAuth, CreateEventHandler);
ROUTER.route("/upload-image").post(CheckUserAuth, upload.single("file"), UploadImageHandler);

module.exports = ROUTER;