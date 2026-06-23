// ------------------------- requiring packages ------------------------- //
const express = require("express");

// ------------------------- initialize router ------------------------- //
const Router = express.Router();

Router.route("/get").get((req, res) => {
    res.send("Get router");
});

module.exports = Router;