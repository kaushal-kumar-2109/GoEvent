const { VerifyToken } = require("../utils/tokenHandler");

const CheckUserAuth = async (req, res, next) => {
    try {
        const { goevent_token } = req.cookies;
        if (!goevent_token) return res.status(401).json({ tag: "token", success: false, message: "Token is missing!" });

        const tokenVerified = await VerifyToken(goevent_token);
        if (!tokenVerified.status) return res.status(401).json({ tag: "token", success: false, message: "Token is invalid!" });

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ tag: "server", success: false, message: "Internal server error", error: error.message });
    }
};

module.exports = { CheckUserAuth }