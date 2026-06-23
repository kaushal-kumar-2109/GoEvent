// ------------------------- requiring packages ------------------------- //
const express = require("express");

// ------------------------- initialize router ------------------------- //
const Router = express.Router();

Router.route("/post").post((req, res) => {
    res.send("Post router");
});

module.exports = Router;