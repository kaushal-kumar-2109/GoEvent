const Event = require("../../db/models/event.model.js");

const GetLandingEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 }).limit(10);
        if (!events) return res.status(404).json({ data: false, message: "No Event found!" });
        return res.status(200).json({ data: events, message: "Event found sucessfully" });
    } catch (err) {
        console.log("err => ", err);
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
        console.log("err => ", err);
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
        console.log("err => ", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error!",
            error: err.message || err
        });
    }
};

const CreateEvent = async (req, res) => {
    const { title, shortDescription, description, category, bannerImage, eventMode, startDate, endDate, registrationDeadline, ticketPrice, availableSeats, contactEmail, contactPhone,
        venueName, address, city, state, country, pincode, googleMapsLink,
        meetingLink, meetingPassword,
        thumbnailImage, promotionalVideo, website, socialLinks, speakers, faqs, refundPolicy, termsAndConditions
    } = req.body;
    try {
        if (!title || !shortDescription || !description || !category || !bannerImage || !eventMode || !startDate || !endDate || !registrationDeadline || !ticketPrice || !availableSeats || !contactEmail || !contactPhone || !refundPolicy || !termsAndConditions) {
            if (!refundPolicy) return res.status(400).json({ tag: "refundPolicy", success: false, message: "Refund Policy is required!" });
            if (!termsAndConditions) return res.status(400).json({ tag: "termsAndConditions", success: false, message: "Terms and Conditions is required!" });
            if (!title) return res.status(400).json({ tag: "title", success: false, message: "Title is required!" });
            if (!shortDescription) return res.status(400).json({ tag: "shortDescription", success: false, message: "Short Description is required!" });
            if (!description) return res.status(400).json({ tag: "description", success: false, message: "Description is required!" });
            if (!category) return res.status(400).json({ tag: "category", success: false, message: "Category is required!" });
            if (!bannerImage) return res.status(400).json({ tag: "bannerImage", success: false, message: "Banner Image is required!" });
            if (!eventMode) return res.status(400).json({ tag: "eventMode", success: false, message: "Event Mode is required!" });
            if (!startDate) return res.status(400).json({ tag: "startDate", success: false, message: "Start Date is required!" });
            if (!endDate) return res.status(400).json({ tag: "endDate", success: false, message: "End Date is required!" });
            if (!registrationDeadline) return res.status(400).json({ tag: "registrationDeadline", success: false, message: "Registration Deadline is required!" });
            if (ticketPrice < 0) return res.status(400).json({ tag: "ticketPrice", success: false, message: "Ticket Price is required!" });
            if (availableSeats == "" || availableSeats < 0) return res.status(400).json({ tag: "availableSeats", success: false, message: "Available Seats is required!" });
            if (!contactEmail) return res.status(400).json({ tag: "contactEmail", success: false, message: "Contact Email is required!" });
            if (!contactPhone) return res.status(400).json({ tag: "contactPhone", success: false, message: "Contact Phone is required!" });
        }
        if (eventMode === "offline") {
            if (!state) return res.status(400).json({ tag: "state", success: false, message: "State is required!" });
            if (!city) return res.status(400).json({ tag: "city", success: false, message: "City is required!" });
            if (!country) return res.status(400).json({ tag: "country", success: false, message: "Country is required!" });
            if (!pincode) return res.status(400).json({ tag: "pincode", success: false, message: "Pincode is required!" });
            if (!address) return res.status(400).json({ tag: "address", success: false, message: "Address is required!" });
            if (!venueName) return res.status(400).json({ tag: "venueName", success: false, message: "Venu Name is required!" });
            if (!googleMapsLink) return res.status(400).json({ tag: "googleMapsLink", success: false, message: "Google Maps Link is required!" });
        }
        if (eventMode === "online") {
            if (!meetingLink) return res.status(400).json({ tag: "meetingLink", success: false, message: "Meeting Link is required!" });
            if (!meetingPassword) return res.status(400).json({ tag: "meetingPassword", success: false, message: "Meeting Password is required!" });
        }

        const newEvent = new Event({
            title, shortDescription, description, category, organizer: req.user._id, organizerName: req.user.name, bannerImage, eventMode, startDate, endDate, registrationDeadline, ticketPrice, availableSeats, contactEmail, contactPhone,
            venueName, address, city, state, country, pincode, googleMapsLink,
            meetingLink, meetingPassword,
            thumbnailImage, promotionalVideo, website, socialLinks, speakers, faqs, refundPolicy, termsAndConditions
        });
        await newEvent.save();
        return res.status(201).json({ success: true, message: "Event Creted successfully", data: newEvent });
    } catch (err) {
        console.log("err => ", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error!",
            error: err.message || err
        });
    }
};

module.exports = { GetLandingEvents, GetEventById, GetAllEvents, CreateEvent };