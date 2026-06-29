const Event = require("../../db/models/event.model.js");

const GetLandingEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 }).limit(10);
        if (!events) return res.status(404).json({ data: false, message: "No Event found!" });
        return res.status(200).json({ data: events, message: "Event found sucessfully" });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error!",
            error: err
        });
    }
}

const GetEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ data: false, message: "Event not found!" });
        return res.status(200).json({ data: event, message: "Event found successfully" });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error!",
            error: err
        });
    }
}

const GetAllEvents = async (req, res) => {
    try {
        const { page = 1, limit = 20, category, date, search } = req.query;
        const query = {};

        // Filter by Category
        if (category && category !== "all") {
            query.category = { $regex: new RegExp(`^${category}$`, "i") };
        }

        // Filter by Search (Name/Title)
        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        // Filter by Date
        if (date) {
            const targetDate = new Date(date);
            if (!isNaN(targetDate.getTime())) {
                const startOfDay = new Date(targetDate);
                startOfDay.setHours(0, 0, 0, 0);

                const endOfDay = new Date(targetDate);
                endOfDay.setHours(23, 59, 59, 999);

                query.startDate = {
                    $gte: startOfDay,
                    $lte: endOfDay
                };
            }
        }

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 20;
        const skipNum = (pageNum - 1) * limitNum;

        const totalCount = await Event.countDocuments(query);
        const events = await Event.find(query)
            .sort({ startDate: 1 })
            .skip(skipNum)
            .limit(limitNum);

        return res.status(200).json({
            data: events,
            totalCount,
            totalPages: Math.ceil(totalCount / limitNum),
            currentPage: pageNum,
            message: "Events fetched successfully"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error!",
            error: err.message || err
        });
    }
};

const CreateEvent = async (req, res) => {
    try {
        return res.status(200).json({ message: "Event Creted successfully" });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error!",
            error: err.message || err
        });
    }
};

module.exports = { GetLandingEvents, GetEventById, GetAllEvents, CreateEvent };