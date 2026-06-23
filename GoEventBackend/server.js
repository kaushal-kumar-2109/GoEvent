// ------------------------- requiring packages ------------------------- //
require("dotenv").config();
const express = require("express");
const cors = require("cors");

// ------------------------- initialize express ------------------------- //
const app = express();
// ------------------------- port number ------------------------- //
const PORT = process.env.PORT || 5000;

// ------------------------- middleware ------------------------- //
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ------------------------- routes ------------------------- //
app.get("/", (req, res) => {
    res.send("Server is running");
});

// ------------------------- start server ------------------------- //
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});