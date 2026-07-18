const Event = require("../models/event.model.js");

const GetLandingEventsHandler = async (req, res) => {
    try {

        const events = await Event.find({ status: "PUBLISHED" }).sort({ createdAt: -1 }).limit(8);
        if (!events || events.length === 0) return res.status(404).json({ tag: "events", success: false, message: "Events not found!" });
        return res.status(200).json({ tag: "events", status: 200, success: true, message: "Events fetched successfully!", events });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ tag: "server", status: 500, success: false, message: "Internal server error!", error: error.message });
    }
}

module.exports = { GetLandingEventsHandler }