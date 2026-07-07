const JWT = require("jsonwebtoken");
const CheckUserAuth = async (req, res, next) => {
    try {
        const tokenData = JSON.parse(req.headers.auth);
        if (!tokenData["token"]) return res.status(401).json({ success: false, message: "Token is required!" });
        if (tokenData["token"] == "") {
            return res.status(403).json({ success: false, message: "Invalid token!" });
        }
        const payLoad = JWT.verify(tokenData["token"], process.env.JWT_SECRET);

        return res.status(400).json({ status: "ok" });
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