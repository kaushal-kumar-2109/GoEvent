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

const GetEventsHandler = async (req, res) => {
    try {
        // await Event.updateMany({ registrationDeadline: { $lt: new Date() } }, { status: "PENDING" });
        // await Event.updateMany({ endDate: { $lt: new Date() } }, { status: "COMPLETED" });
        // await Event.updateMany({ startDate: { $lte: new Date() } }, { status: "STARTED" });
        const {
            search, location, status, date, category, minPrice, maxPrice, eventType, sortBy, page = 1, limit = 8
        } = req.query;

        const query = {};
        if (status) {
            query.status = status;
        } else {
            query.status = {
                $in: ["PUBLISHED", "PENDING", "STARTED", "COMPLETED"]
            };
        }

        // 1. Search filter
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { shortDescription: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        // 2. Location filter
        if (location) {
            const locQuery = [
                { city: { $regex: location, $options: "i" } },
                { state: { $regex: location, $options: "i" } },
                { venueName: { $regex: location, $options: "i" } },
                { address: { $regex: location, $options: "i" } }
            ];
            if (query.$or) {
                // If search already populated $or, wrap them in $and
                query.$and = query.$and || [];
                query.$and.push({ $or: query.$or });
                delete query.$or;
                query.$and.push({ $or: locQuery });
            } else {
                query.$or = locQuery;
            }
        }

        // 3. Category filter
        if (category) {
            const categoriesList = category.split(",").filter(Boolean);
            if (categoriesList.length > 0) {
                query.category = { $in: categoriesList.map(c => new RegExp(`^${c.trim()}$`, "i")) };
            }
        }

        // 4. Date filter
        if (date) {
            const now = new Date();
            if (date === "today") {
                const todayEnd = new Date();
                todayEnd.setHours(23, 59, 59, 999);
                query.startDate = { $gte: now, $lte: todayEnd };
            } else if (date === "this-weekend") {
                const today = now.getDay();
                const diffToFriday = today <= 5 ? 5 - today : 12 - today;
                const friday = new Date(now);
                friday.setDate(now.getDate() + diffToFriday);
                friday.setHours(0, 0, 0, 0);

                const sunday = new Date(friday);
                sunday.setDate(friday.getDate() + 2);
                sunday.setHours(23, 59, 59, 999);

                query.startDate = { $gte: now, $lte: sunday };
            } else if (date === "next-7-days") {
                const nextWeek = new Date();
                nextWeek.setDate(now.getDate() + 7);
                query.startDate = { $gte: now, $lte: nextWeek };
            } else if (date === "next-30-days") {
                const nextMonth = new Date();
                nextMonth.setDate(now.getDate() + 30);
                query.startDate = { $gte: now, $lte: nextMonth };
            }
        }

        // 5. Price range filter
        if (minPrice !== undefined || maxPrice !== undefined) {
            query.ticketPrice = {};
            if (minPrice !== undefined) {
                query.ticketPrice.$gte = Number(minPrice);
            }
            if (maxPrice !== undefined) {
                const maxVal = Number(maxPrice);
                if (maxVal < 500) {
                    query.ticketPrice.$lte = maxVal;
                }
            }
        }

        // 6. Event Type filter (PUBLIC, PRIVATE)
        if (eventType) {
            const types = eventType.split(",").map(t => t.trim().toUpperCase()).filter(Boolean);
            if (types.length > 0) {
                // If filtering by public or private, we also match eventType: "ALL"
                const allowedTypes = [...types, "ALL"];
                query.eventType = { $in: allowedTypes };
            }
        }

        // Sorting options
        let sortOption = { startDate: 1 };
        if (sortBy === "price-low") {
            sortOption = { ticketPrice: 1 };
        } else if (sortBy === "price-high") {
            sortOption = { ticketPrice: -1 };
        } else if (sortBy === "popular") {
            sortOption = { likes: -1 };
        } else if (sortBy === "newest") {
            sortOption = { createdAt: -1 };
        }

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.max(1, parseInt(limit));
        const skip = (pageNum - 1) * limitNum;

        const totalEvents = await Event.countDocuments(query);
        const events = await Event.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum);

        return res.status(200).json({
            tag: "events",
            status: 200,
            success: true,
            message: "Events fetched successfully!",
            data: {
                events,
                pagination: {
                    totalEvents,
                    totalPages: Math.ceil(totalEvents / limitNum),
                    currentPage: pageNum,
                    limit: limitNum
                }
            }
        });
    } catch (error) {
        console.error("GetEventsHandler Error:", error);
        return res.status(500).json({
            tag: "server",
            status: 500,
            success: false,
            message: "Internal server error!",
            error: error.message
        });
    }
}

const GetEventDetailsHandler = async (req, res) => {
    try {
        const { eid } = req.params;
        const event = await Event.findById(eid);
        if (!event) return res.status(404).json({ tag: "event", status: 404, success: false, message: "Event not found!" });

        if (event.status === "DRAFT" || event.status === "CANCELLED" || event.status === "DELETED") return res.status(403).json({ tag: "event", status: 403, success: false, message: "You cant access event anymore!" });

        return res.status(200).json({
            tag: "events",
            status: 200,
            success: true,
            message: "Event fetched successfully!",
            event
        });
    } catch (error) {
        console.error("GetEventsHandler Error:", error);
        return res.status(500).json({
            tag: "server",
            status: 500,
            success: false,
            message: "Internal server error!",
            error: error.message
        });
    }
}

module.exports = { GetLandingEventsHandler, GetEventsHandler, GetEventDetailsHandler }