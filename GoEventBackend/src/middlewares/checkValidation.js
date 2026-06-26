const User = require("../../db/models/user.model.js");
const Otp = require("../../db/models/otp.model.js");

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const CheckUserValidation = async (req, res, next) => {

    try {

        const { email, otp, password } = req.body;

        if (!email) return res.status(400).json({ tag: "email", success: false, message: "Email is required!" });
        if (!otp) return res.status(400).json({ tag: "otp", success: false, message: "OTP is required!" });
        if (!password) return res.status(400).json({ tag: "password", success: false, message: "Password is required    !" });
        if (!isValidEmail(email)) return res.status(400).json({ tag: "email", success: false, message: "Invalid email!" });
        if (password.length < 8) return res.status(400).json({ tag: "password", success: false, message: "Password must be at least 8 characters long!" });

        const user = await User.findOne({ email });
        // Check if user is locked
        if (user && user.lockedUntil != null) {
            const timeRemains = user.lockedUntil - new Date();
            const timeInMinutes = timeRemains / 1000 / 60;
            if (timeInMinutes > 0) {
                return res.status(403).json({ success: false, message: `Account is locked! try again after ${timeInMinutes} minutes.` });
            }
            await User.updateOne({ email }, { lockedUntil: null, attempts: 3, status: "ACTIVE" });
        }
        if (user && user.status == "LOCKED") return res.status(403).json({ success: false, message: "Account is locked! try again after some time." });
        if (!user) return res.status(400).json({ tag: "email", success: false, message: "User not found with this email!" });

        const otpData = await Otp.findOne({ email });
        if (!otpData) return res.status(400).json({ tag: "otp", success: false, message: "OTP Expired or not found!" });
        if (parseInt(otpData.otp) !== parseInt(otp)) {
            otpData.attempts -= 1;
            await otpData.save();
            if (otpData.attempts === 0) await Otp.deleteOne({ email });
            return res.status(400).json({ tag: "otp", success: false, message: `Invalid OTP! ${otpData.attempts} attempts left.` });
        }
        if (otpData.exp < Date.now()) return res.status(400).json({ tag: "otp", success: false, message: "OTP Expired!" });
        await Otp.deleteOne({ email });

        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Internal server error!" });
    }

}


module.exports = { CheckUserValidation };