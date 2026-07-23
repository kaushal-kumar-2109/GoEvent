// ------------------------- configration package and file ------------------------- 
require("dotenv").config(); // --- dotenv configration
require("./config/db.connect.js"); // --- database configration
require("./config/cloudynary.config.js"); // --- cloudynary configration

// ------------------------- Package requiring ------------------------- 
const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require("cors");

// ------------------------- initialize express ------------------------- //
const app = express();
const apiVersion = process.env.API_VERSION;
const port = process.env.PORT || 3000;

// ------------------------- app midleware configration ------------------------- 
app.use(express.json()); // --- express json configration
app.use(express.urlencoded({ extended: true })); // --- express urlencoded configration
app.use(cors({
    origin: ["http://ec2-16-170-208-12.eu-north-1.compute.amazonaws.com", "http://localhost:5173", "http://192.168.1.18:3000"],
    credentials: true
}));
app.use(cookieParser());

// ------------------------- import router files ------------------------- //
const getRouter = require("./src/routers/get.router.js");
const postRouter = require("./src/routers/post.router.js");
const putRouter = require("./src/routers/put.router.js");
const deleteRouter = require("./src/routers/delete.router.js");

// ------------------------- routes ------------------------- //
app.use(`/api/${apiVersion}/goevent/gets`, getRouter);
app.use(`/api/${apiVersion}/goevent/posts`, postRouter);
app.use(`/api/${apiVersion}/goevent/puts`, putRouter);
app.use(`/api/${apiVersion}/goevent/deletes`, deleteRouter);

// root router for check
app.get("/", (req, res) => {
    res.status(200).json({ status: "success", statusCode: 200, message: "Server is running", data: null });
});

// test router for check
app.get("/test-path", (req, res) => {
    res.json({ status: "success", statusCode: 200, message: "Test for the server", data: null, reqIp: req.headers["x-forwarded-for"] || req.ip });
});

// all other invalid route
app.all("/*path", (req, res) => {
    res.status(404).json({ status: "error", statusCode: 404, message: "Invalid route", data: null });
});

// ------------------------- start server ------------------------- //
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});