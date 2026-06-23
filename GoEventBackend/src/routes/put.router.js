// ------------------------- requiring packages ------------------------- //
const express = require("express");

// ------------------------- initialize router ------------------------- //
const Router = express.Router();

Router.route("/put").post((req, res) => {
    res.send("Put router");
});

module.exports = Router;