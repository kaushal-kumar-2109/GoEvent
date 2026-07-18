const bcrypt = require("bcrypt");
const User = require("../models/user.model.js");
const Otp = require("../models/otp.model.js");
const SendEmail = require("../utils/sendOtp.js");
const { CreateToken } = require("../utils/tokenHandler.js");

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const UserEmailVerificationHandler = async (req, res) => {
    try {
        const { email, task } = req.body;
        await Otp.deleteOne({ email });
        if (!email) return res.status(400).json({ tag: "email", status: 400, success: false, message: "Email is required!" });
        if (!task) return res.status(400).json({ tag: "task", status: 400, success: false, message: "Task is required!" });
        if (!isValidEmail(email)) return res.status(400).json({ tag: "email", status: 400, success: false, message: "Invalid email!" });

        const userData = await User.findOne({ email });

        if (task === "register" && userData) return res.status(400).json({ tag: "email", status: 400, success: false, message: "User already exists with this email!" });
        if (task === "recover" && !userData) return res.status(400).json({ tag: "email", status: 400, success: false, message: "User not found with this email!" });
        if (task !== "register" && task !== "recover") return res.status(400).json({ tag: "task", status: 400, success: false, message: "Invalid task!" });

        // Check if user is locked
        if (userData && userData.lockedUntil != null) {
            const timeRemains = userData.lockedUntil - new Date();
            const timeInMinutes = timeRemains / 1000 / 60;
            if (timeInMinutes > 0) return res.status(403).json({ success: false, status: 403, tag: "server", message: `Account is locked! try again after ${timeInMinutes} minutes.` });

            await User.updateOne({ email }, { lockedUntil: null, attempts: 3, status: "ACTIVE" });
        }
        if (userData && userData.status == "LOCKED") return res.status(403).json({ success: false, status: 403, tag: "server", message: "Account is locked! try again after some time." });

        const otp = Math.floor(100000 + Math.random() * 900000);
        // const expirationTime = Date.now() + 5 * 60 * 1000;
        await Otp.create({ email, otp });

        const otpRes = await SendEmail(email, otp, tag = task);
        if (!otpRes.status) return res.status(500).json({ success: false, status: 500, tag: "server", message: otpRes.message });
        return res.status(200).json({ success: true, status: 200, tag: "otp", message: "OTP sent successfully!" });

    } catch (err) {
        console.log("err => ", err);
        return res.status(500).json({ success: false, status: 500, tag: "server", message: "Internal server error!" });
    }

};



const UserOtpVerifyCreateUserHandler = async (req, res) => {
    try {
        const { name, email, password, role, otp, } = req.body;

        if (!name) return res.status(400).json({ success: false, status: 400, tag: "name", message: "Name is required!" });
        if (!email) return res.status(400).json({ success: false, status: 400, tag: "email", message: "Email is required!" });
        if (!password) return res.status(400).json({ success: false, status: 400, tag: "password", message: "Password is required!" });
        if (!role) return res.status(400).json({ success: false, status: 400, tag: "role", message: "Role is required!" });
        if (!otp) return res.status(400).json({ success: false, status: 400, tag: "otp", message: "Otp is required!" });

        const checkIsUser = await User.findOne({ email });
        if (checkIsUser) return res.status(400).json({ success: false, status: 400, tag: "email", message: "User already exists with this email!" });

        const checkOtp = await Otp.findOne({ email });
        if (!checkOtp) return res.status(400).json({ success: false, status: 400, tag: "otp", message: "Otp expired!" });

        if (parseInt(checkOtp.otp) !== parseInt(otp)) return res.status(400).json({ success: false, status: 400, tag: "otp", message: "Invalid Otp!" });
        await Otp.deleteOne({ email });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ name, email, userName: email.split("@")[0], password: hashedPassword, role });
        const TokenRes = await CreateToken(newUser);
        if (!TokenRes.status) return res.status(500).json({ success: false, status: 500, tag: "server", message: TokenRes.message });

        res.cookie("GoEventUserToken", TokenRes.token, {
            httpOnly: true,
            secure: (process.env.NODE_ENV === "local") ? false : true,
            sameSite: (process.env.NODE_ENV === "local") ? "lax" : "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        await newUser.save();
        return res.status(200).json({ success: true, status: 200, tag: "user", message: "User created successfully!" });

    } catch (err) {
        console.log("err => ", err);
        return res.status(500).json({ success: false, status: 500, tag: "server", message: "Internal server error!" });
    }
}

module.exports = { UserEmailVerificationHandler, UserOtpVerifyCreateUserHandler };
