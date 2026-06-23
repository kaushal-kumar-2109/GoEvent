// ------------------------- requiring packages ------------------------- //
const express = require("express");

// ------------------------- initialize router ------------------------- //
const Router = express.Router();

Router.route("/delete").post((req, res) => {
    res.send("Delete router");
});

module.exports = Router;