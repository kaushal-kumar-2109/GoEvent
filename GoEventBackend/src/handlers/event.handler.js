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
        await Event.updateMany({ registrationDeadline: { $lt: new Date() } }, { status: "PENDING" });
        await Event.updateMany({ endDate: { $lt: new Date() } }, { status: "COMPLETED" });
        await Event.updateMany({ startDate: { $lte: new Date() } }, { status: "STARTED" });
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

const fs = require("fs");
const { uploadFile } = require("../cloudynary/cloudynary.js");

const UploadImageHandler = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ tag: "upload", success: false, message: "No file uploaded!" });
        }

        if (req.user.role === "USER") return res.status(403).json({ tag: "role", success: false, message: "your account is not authorized for create event!" });


        const result = await uploadFile(req.file.path);

        // Delete the temporary local file
        try {
            fs.unlinkSync(req.file.path);
        } catch (unlinkErr) {
            console.error("Failed to delete temp file:", unlinkErr);
        }

        if (!result.status) {
            return res.status(500).json({ tag: "upload", success: false, message: result.message, error: result.info });
        }

        return res.status(200).json({
            tag: "upload",
            success: true,
            message: "Image uploaded successfully!",
            url: result.data.secure_url
        });
    } catch (error) {
        console.error("UploadImageHandler Error:", error);
        return res.status(500).json({ tag: "server", success: false, message: "Internal server error!", error: error.message });
    }
};

const CreateEventHandler = async (req, res) => {
    try {
        const {
            title, shortDescription, description, category, bannerImage, thumbnailImage, galleryImages, promotionalVideo, eventType,
            venueName, address, city, state, country, pincode, googleMapsLink, startDate, endDate, registrationDeadline, ticketPrice, totalSeats,
            availableSeats, contactEmail, contactPhone, website, socialLinks,
            speakers, faqs, refundPolicy, termsAndConditions, paymentQr, paymentUPI, paymentUPIName, schedule, status
        } = req.body;

        if (req.user.role === "USER") return res.status(403).json({ tag: "role", success: false, message: "your account is not authorized for create event!" });

        // Validation of required fields
        if (!title || !shortDescription || !description || !category || !bannerImage || !startDate || !endDate) {
            return res.status(400).json({
                tag: "validation",
                success: false,
                message: "Title, short description, description, category, banner image, start date, and end date are required!"
            });
        }
        if (status != "DRAFT") {
            if (!paymentQr || !paymentUPI || !paymentUPIName) {
                if (!paymentQr) return res.status(400).json({ tag: "paymentQr", success: false, message: "PaymentQr is required!" });
                if (!paymentUPI) return res.status(400).json({ tag: "paymentUpi", success: false, message: "PaymentUpi is required!" });
                if (!paymentUPIName) return res.status(400).json({ tag: "paymentUPIName", success: false, message: "PaymentUPIName is required!" });
            }
        };

        const newEvent = new Event({
            title,
            shortDescription,
            description,
            category,
            organizer: req.user._id,
            organizerName: req.user.name,
            bannerImage,
            thumbnailImage: thumbnailImage || bannerImage, // Fallback to banner if thumbnail not provided
            galleryImages: galleryImages || [],
            promotionalVideo,
            eventType: eventType || "PUBLIC",
            venueName,
            address,
            city,
            state,
            country: country || "India",
            pincode,
            googleMapsLink,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : undefined,
            ticketPrice: ticketPrice !== undefined ? Number(ticketPrice) : 0,
            totalSeats: totalSeats !== undefined ? Number(totalSeats) : 0,
            availableSeats: availableSeats !== undefined ? Number(availableSeats) : (totalSeats !== undefined ? Number(totalSeats) : 0),
            contactEmail: contactEmail || req.user.email,
            contactPhone: contactPhone || req.user.phone,
            website,
            socialLinks: socialLinks || {},
            speakers: speakers || [],
            faqs: faqs || [],
            refundPolicy,
            termsAndConditions,
            paymentQr,
            paymentUPI,
            paymentUPIName,
            schedule: schedule || [],
            status: status || "DRAFT" // Newly created event status is DRAFT by default
        });

        await newEvent.save();

        return res.status(201).json({
            tag: "event",
            status: 201,
            success: true,
            message: "Event created successfully!",
            event: newEvent
        });
    } catch (error) {
        console.error("CreateEventHandler Error:", error);
        return res.status(500).json({
            tag: "server",
            status: 500,
            success: false,
            message: "Internal server error!",
            error: error.message
        });
    }
};

const GetOrganizerEventsHandler = async (req, res) => {
    try {
        const events = await Event.find({ organizer: req.user._id }).sort({ createdAt: -1 });
        return res.status(200).json({
            tag: "events",
            status: 200,
            success: true,
            message: "Organizer events fetched successfully!",
            events
        });
    } catch (error) {
        console.error("GetOrganizerEventsHandler Error:", error);
        return res.status(500).json({
            tag: "server",
            status: 500,
            success: false,
            message: "Internal server error!",
            error: error.message
        });
    }
};

const DeleteEventHandler = async (req, res) => {
    try {
        const { eid } = req.params;
        const event = await Event.findById(eid);
        if (!event) {
            return res.status(404).json({ tag: "event", status: 404, success: false, message: "Event not found!" });
        }

        // Authorization check
        if (event.organizer.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                tag: "auth",
                status: 403,
                success: false,
                message: "You are not authorized to delete this event!"
            });
        }

        await Event.findByIdAndDelete(eid);

        return res.status(200).json({
            tag: "event",
            status: 200,
            success: true,
            message: "Event deleted successfully!"
        });
    } catch (error) {
        console.error("DeleteEventHandler Error:", error);
        return res.status(500).json({
            tag: "server",
            status: 500,
            success: false,
            message: "Internal server error!",
            error: error.message
        });
    }
};

const GetOrganizerEventDetailsHandler = async (req, res) => {
    try {
        const { eid } = req.params;
        const event = await Event.findById(eid);
        let note = "";
        if (!event) return res.status(404).json({ tag: "event", status: 404, success: false, message: "Event not found!" });
        if (event.organizer.toString() !== req.user._id.toString()) return res.status(403).json({ tag: "auth", status: 403, success: false, message: "You are not authorized to view this event's details!" });

        if (event.status === "STARTED" || event.status === "COMPLETED" || event.status === "CANCELLED" || event.status === "DELETED")
            note = "You can't update event information.";
        if (event.status === "PENDING")
            note = `You can only update "registration Deadline", "event start date" and "event end date". If you increse the "registration date" then event status will change.`;
        if (event.status === "PUBLISHED")
            note = `You can't update "ticket price", "category", "event type", "refund policy", "terms and conditions" and "payment details"`;
        if (event.status === "DRAFT")
            note = `You can update all event information.`;

        return res.status(200).json({ tag: "event", status: 200, success: true, message: "Event details fetched successfully!", event, note });
    } catch (error) {
        console.error("GetOrganizerEventDetailsHandler Error:", error);
        return res.status(500).json({
            tag: "server",
            status: 500,
            success: false,
            message: "Internal server error!",
            error: error.message
        });
    }
};

const UpdateEventHandler = async (req, res) => {
    try {
        const { eid } = req.params;
        const event = await Event.findById(eid);
        if (!event) return res.status(404).json({ tag: "event", status: 404, success: false, message: "Event not found!" });

        // Authorization check
        if (event.organizer.toString() !== req.user._id.toString()) return res.status(403).json({ tag: "auth", status: 403, success: false, message: "You are not authorized to edit this event!" });
        if (req.user.role === "USER") return res.status(403).json({ tag: "role", success: false, message: "Your account is not authorized to edit events!" });
        if (event.status === "STARTED" || event.status === "COMPLETED" || event.status === "CANCELLED" || event.status === "DELETED") return res.status(400).json({ tag: "event", status: 400, success: false, message: "You can't update event!" });

        const {
            title, shortDescription, description, status, organizerName, bannerImage, thumbnailImage, galleryImages, promotionalVideo,
            schedule, venueName, address, city, state, country, pincode, googleMapsLink, availableSeats, contactEmail, contactPhone, website, socialLinks, speakers, faqs,
            startDate, endDate, registrationDeadline, ticketPrice, refundPolicy, termsAndConditions, eventType, category, paymentQr, paymentUPI, paymentUPIName
        } = req.body;

        if (event.status === "PUBLISHED" || event.status === "PENDING") {
            if (ticketPrice !== event.ticketPrice) return res.status(400).json({ tag: "event", status: 400, success: false, message: "You can't update ticket price for this event!" });
            if (category !== event.category) return res.status(400).json({ tag: "event", status: 400, success: false, message: "You can't update category for the Event!" });
            if (eventType !== event.eventType) return res.status(400).json({ tag: "event", status: 400, success: false, message: "You can't update event type for the Event!" });
            if (refundPolicy !== event.refundPolicy) return res.status(400).json({ tag: "event", status: 400, success: false, message: "You can't update refund policy for the Event!" });
            if (termsAndConditions !== event.termsAndConditions) return res.status(400).json({ tag: "event", status: 400, success: false, message: "You can't update terms and conditions for the Event!" });
            if (paymentQr !== event.paymentQr) return res.status(400).json({ tag: "event", status: 400, success: false, message: "You can't update payment QR for the Event!" });
            if (paymentUPI !== event.paymentUPI) return res.status(400).json({ tag: "event", status: 400, success: false, message: "You can't update payment UPI for the Event!" });
            if (paymentUPIName !== event.paymentUPIName) return res.status(400).json({ tag: "event", status: 400, success: false, message: "You can't update payment UPI name for the Event!" });
            if (event.registrationDeadline != registrationDeadline || event.startDate != startDate || event.endDate != endDate) {
                if (new Date(registrationDeadline) <= Date.now()) return res.status(400).json({ tag: "event", status: 400, success: false, message: "Registration deadline can't be before then today!" });
                if (new Date(startDate) <= Date.now()) return res.status(400).json({ tag: "event", status: 400, success: false, message: "Start date can't be before then today!" });
                if (new Date(endDate) <= Date.now()) return res.status(400).json({ tag: "event", status: 400, success: false, message: "End date can't be before then today!" });
            }

            if (event.status === "PUBLISHED") {
                event.title = title; event.shortDescription = shortDescription; event.description = description;
                event.organizerName = organizerName; event.bannerImage = bannerImage; event.thumbnailImage = thumbnailImage;
                event.galleryImages = galleryImages; event.promotionalVideo = promotionalVideo; event.schedule = schedule;
                event.venueName = venueName; event.address = address; event.city = city; event.state = state;
                event.country = country; event.pincode = pincode; event.googleMapsLink = googleMapsLink;
                event.availableSeats = availableSeats; event.contactEmail = contactEmail; event.contactPhone = contactPhone;
                event.website = website; event.socialLinks = socialLinks; event.speakers = speakers; event.faqs = faqs;
                event.registrationDeadline = registrationDeadline; event.startDate = startDate; event.endDate = endDate;
            }
        }

        if (event.status === "PENDING") {
            if (title !== event.title) return res.status(400).json({ tag: "email", status: 400, success: false, message: "Title can't update!" });
            if (shortDescription !== event.shortDescription) return res.status(400).json({ tag: "email", status: 400, success: false, message: "Short description can't update!" });
            if (description !== event.description) return res.status(400).json({ tag: "email", status: 400, success: false, message: "Description can't update!" });
            if (organizerName !== event.organizerName) return res.status(400).json({ tag: "email", status: 400, success: false, message: "Organizer name can't update!" });
            if (bannerImage !== event.bannerImage) return res.status(400).json({ tag: "email", status: 400, success: false, message: "Banner image can't update!" });
            if (thumbnailImage !== event.thumbnailImage) return res.status(400).json({ tag: "email", status: 400, success: false, message: "Thumbnail image can't update!" });
            if (galleryImages !== event.galleryImages) return res.status(400).json({ tag: "email", status: 400, success: false, message: "Gallery images can't update!" });
            if (promotionalVideo !== event.promotionalVideo) return res.status(400).json({ tag: "email", status: 400, success: false, message: "Promotional video can't update!" });
            if (schedule !== event.schedule) return res.status(400).json({ tag: "email", status: 400, success: false, message: "Schedule can't update!" });
            if (venueName !== event.venueName) return res.status(400).json({ tag: "email", status: 400, success: false, message: "Venue name can't update!" });
            if (address !== event.address) return res.status(400).json({ tag: "email", status: 400, success: false, message: "Address can't update!" });
            if (city !== event.city) return res.status(400).json({ tag: "email", status: 400, success: false, message: "City can't update!" });
            if (state !== event.state) return res.status(400).json({ tag: "email", status: 400, success: false, message: "State can't update!" });
            if (country !== event.country) return res.status(400).json({ tag: "email", status: 400, success: false, message: "Country can't update!" });
            if (pincode !== event.pincode) return res.status(400).json({ tag: "email", status: 400, success: false, message: "Pincode can't update!" });
            if (googleMapsLink !== event.googleMapsLink) return res.status(400).json({ tag: "email", status: 400, success: false, message: "Google maps link can't update!" });
            if (availableSeats !== event.availableSeats) return res.status(400).json({ tag: "email", status: 400, success: false, message: "Available seats can't update!" });
            if (contactEmail !== event.contactEmail) return res.status(400).json({ tag: "email", status: 400, success: false, message: "Contact email can't update!" });
            if (contactPhone !== event.contactPhone) return res.status(400).json({ tag: "email", status: 400, success: false, message: "Contact phone can't update!" });
            if (website !== event.website) return res.status(400).json({ tag: "email", status: 400, success: false, message: "Website can't update!" });
            if (socialLinks !== event.socialLinks) return res.status(400).json({ tag: "email", status: 400, success: false, message: "Social links can't update!" });
            if (speakers !== event.speakers) return res.status(400).json({ tag: "email", status: 400, success: false, message: "Speakers can't update!" });
            if (faqs !== event.faqs) return res.status(400).json({ tag: "email", status: 400, success: false, message: "FAQs can't update!" });
            if (event.registrationDeadline != registrationDeadline || event.startDate != startDate || event.endDate != endDate) {
                if (new Date(registrationDeadline) <= Date.now()) return res.status(400).json({ tag: "event", status: 400, success: false, message: "Registration deadline can't be before then today!" });
                if (new Date(startDate) <= Date.now()) return res.status(400).json({ tag: "event", status: 400, success: false, message: "Start date can't be before then today!" });
                if (new Date(endDate) <= Date.now()) return res.status(400).json({ tag: "event", status: 400, success: false, message: "End date can't be before then today!" });
            }

            event.registrationDeadline = registrationDeadline;
            event.startDate = startDate;
            event.endDate = endDate;
            event.status = "PUBLISHED";
        }

        if (event.status === "DRAFT") {
            event.title = title; event.shortDescription = shortDescription;
            event.description = description; event.organizerName = organizerName; event.bannerImage = bannerImage; event.thumbnailImage = thumbnailImage; event.galleryImages = galleryImages;
            event.promotionalVideo = promotionalVideo; event.schedule = schedule; event.venueName = venueName; event.address = address; event.city = city;
            event.state = state; event.country = country; event.pincode = pincode; event.googleMapsLink = googleMapsLink; event.availableSeats = availableSeats;
            event.contactEmail = contactEmail; event.contactPhone = contactPhone; event.website = website; event.socialLinks = socialLinks; event.speakers = speakers;
            event.faqs = faqs; event.registrationDeadline = registrationDeadline; event.startDate = startDate; event.endDate = endDate; event.ticketPrice = ticketPrice;
            event.refundPolicy = refundPolicy; event.termsAndConditions = termsAndConditions; event.eventType = eventType; event.category = category;
            event.paymentQr = paymentQr; event.paymentUPI = paymentUPI; event.paymentUPIName = paymentUPIName; event.status = status;
        }

        event.updatedAt = Date.now();
        await event.save();

        return res.status(200).json({
            tag: "event",
            status: 200,
            success: true,
            message: "Event updated successfully!",
            event
        });
    } catch (error) {
        console.error("UpdateEventHandler Error:", error);
        return res.status(500).json({ tag: "server", status: 500, success: false, message: "Internal server error!", error: error.message });
    }
};

module.exports = {
    GetLandingEventsHandler, GetEventsHandler, GetEventDetailsHandler, UploadImageHandler, CreateEventHandler, GetOrganizerEventsHandler,
    DeleteEventHandler, GetOrganizerEventDetailsHandler, UpdateEventHandler
}
