// ------------------------- Package requiring ------------------------- 
const express = require('express');
const { CheckUserAuth } = require('../middleware/auth.midleware');
const { DeleteEventHandler } = require('../handlers/event.handler');

const ROUTER = express.Router();

ROUTER.route("/delete-event/:eid").delete(CheckUserAuth, DeleteEventHandler);

module.exports = ROUTER;