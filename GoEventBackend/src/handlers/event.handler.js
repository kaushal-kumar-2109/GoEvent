const Event = require("../../db/models/event.model.js");

const GetLandingEvents = async (req,res) => {
    try{
        const events = await Event.find().sort({ createdAt: -1 }).limit(10);
        if(!events) return res.status(404).json({data:false,message:"No Event found!"});
        return res.status(200).json({data:events,message:"Event found sucessfully"});
    }catch(err){
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

module.exports = { GetLandingEvents, GetEventById };