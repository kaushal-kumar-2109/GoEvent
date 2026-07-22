const { VerifyToken } = require("../utils/tokenHandler");
const Token = require("../models/token.model.js");
const User = require("../models/user.model.js");

const CheckUserAuth = async (req, res, next) => {
    try {
        const { GoEventUserToken } = req.cookies;

        if (!GoEventUserToken) return res.status(401).json({ tag: "token", status: 401, success: false, message: "Token is missing!" });

        const getTokenData = await Token.findOne({ token: GoEventUserToken });
        if (!getTokenData) return res.status(401).json({ tag: "token", status: 401, success: false, message: "Token is invalid!" });

        if (getTokenData.expiresAt < Date.now()) {
            return res.status(401).json({ tag: "token", status: 401, success: false, message: "Token is expired!" });
        }

        const tokenVerified = await VerifyToken(GoEventUserToken);
        if (!tokenVerified.status) return res.status(401).json({ tag: "token", status: 401, success: false, message: "Token is invalid!" });

        const userData = await User.findOne({ _id: tokenVerified.userPayload._id });
        if (!userData) return res.status(401).json({ tag: "user", status: 401, success: false, message: "User not found!" });
        if (userData.status != "ACTIVE") return res.status(401).json({ tag: "user", status: 401, success: false, message: (userData.status === "LOCKED") ? "Your Account is locked" : (userData.status === "INACTIVE") ? "Your account is lokend" : "Your account is deleted" });

        req.user = userData;

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ tag: "server", status: 500, success: false, message: "Internal server error", error: error.message });
    }
};

module.exports = { CheckUserAuth }