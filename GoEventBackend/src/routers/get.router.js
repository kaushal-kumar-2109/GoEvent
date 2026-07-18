// ------------------------- Package requiring ------------------------- 
const express = require('express');
const { GetLandingEventsHandler } = require('../handlers/event.handler');

const ROUTER = express.Router();

// ------------------------- routers ------------------------- //
ROUTER.route("/get-landing-events").get(GetLandingEventsHandler);

module.exports = ROUTER;