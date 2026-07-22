// ------------------------- Package requiring ------------------------- 
const express = require('express');
const { CheckUserAuth } = require('../middleware/auth.midleware');
const { UpdateEventHandler } = require('../handlers/event.handler');

const ROUTER = express.Router();

ROUTER.route("/update-event/:eid").put(CheckUserAuth, UpdateEventHandler);

module.exports = ROUTER;