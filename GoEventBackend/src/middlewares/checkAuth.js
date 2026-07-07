const JWT = require("jsonwebtoken");
const User = require("../../db/models/user.model.js");
const Token = require("../../db/models/token.model.js");
const CheckUserAuth = async (req, res, next) => {
    try {
        const { goeventjwt } = req.cookies;

        if (!goeventjwt) return res.status(401).json({ success: false, message: "Token is required!" });
        if (goeventjwt == "") return res.status(403).json({ success: false, message: "Invalid token!" });

        const tokenData = await Token.findOne({ token: goeventjwt });
        if (!tokenData) return res.status(401).json({ success: false, message: "Invalid token!", info: "expired" });
        if (tokenData.expiresAt < Date.now()) {
            await Token.deleteOne({ _id: tokenData._id });
            return res.status(401).json({ success: false, message: "Token is expired!", info: "expired" });
        }

        const userData = await User.findOne({ _id: tokenData.userId });
        if (!userData) return res.status(404).json({ success: false, message: "User not found!" });
        if (userData.status != "ACTIVE") return res.status(403).json({ success: false, message: "User is blocked!" });

        req.user = userData;
        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error!",
            error: err.message || err
        });
    }
};

module.exports = { CheckUserAuth };