// ------------------------- requiring packages ------------------------- //
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// ------------------------- import connect function ------------------------- //
require("./db/connect.js");

// ------------------------- import router files ------------------------- //
const getRouter = require("./src/routes/get.router.js");
const postRouter = require("./src/routes/post.router.js");
const updateRouter = require("./src/routes/put.router.js");
const deleteRouter = require("./src/routes/delete.router.js");

// ------------------------- initialize express ------------------------- //
const app = express();
// ------------------------- port number ------------------------- //
const PORT = process.env.PORT || 5000;

// ------------------------- middleware ------------------------- //
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser());

// ------------------------- routes ------------------------- //
app.use("/GoEvent", getRouter);
app.use("/GoEvent", postRouter);
app.use("/GoEvent", updateRouter);
app.use("/GoEvent", deleteRouter);

// root router for check
app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Server is running",
        data: null
    });
});

// all other invalid route
app.all("*path", (req, res) => {
    res.status(404).json({
        status: "error",
        statusCode: 404,
        message: "Invalid route",
        data: null
    });
});

// ------------------------- start server ------------------------- //
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});