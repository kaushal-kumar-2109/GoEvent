const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');

const User = require("../../db/models/user.model.js");
const Otp = require("../../db/models/otp.model.js");
const Token = require("../../db/models/token.model.js");

const CreateUserToken = require("../utils/createToken.js");
const SendEmail = require("../utils/sendOtp.js");

// Helper for strict email syntax validation
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ------------------------- for creating user -------------------------
const CreateUser = async (req, res) => {
    try {
        const { name, email, password, otp, organisation, phone } = req.body;

        // Direct validation fixes the bypass vulnerability
        if (!name) return res.status(400).json({ tag: "name", success: false, message: "Name is required!" });
        if (!email) return res.status(400).json({ tag: "email", success: false, message: "Email is required!" });
        if (!password) return res.status(400).json({ tag: "password", success: false, message: "Password is required!" });
        if (password.length < 8) return res.status(400).json({ tag: "password", success: false, message: "Password must be at least 8 characters long!" });
        if (!otp) return res.status(400).json({ tag: "otp", success: false, message: "OTP is required!" });
        if (!phone) return res.status(400).json({ tag: "phone", success: false, message: "Phone is required!" });
        if (!organisation) return res.status(400).json({ tag: "organisation", success: false, message: "Organisation is required!" });

        if (!isValidEmail(email)) return res.status(400).json({ tag: "email", success: false, message: "Invalid email structure!" });

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ tag: "email", success: false, message: "User already exists!" });

        const otpData = await Otp.findOne({ email });
        if (!otpData) return res.status(400).json({ tag: "otp", success: false, message: "OTP Expired or not found!" });
        if (parseInt(otpData.otp) !== parseInt(otp)) {
            otpData.attempts -= 1;
            await otpData.save();
            if (otpData.attempts === 0) await Otp.deleteOne({ email });
            return res.status(400).json({ tag: "otp", success: false, message: `Invalid OTP! ${otpData.attempts} attempts left.` });
        }
        if (otpData.exp < Date.now()) return res.status(400).json({ tag: "otp", success: false, message: "OTP Expired!" });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, password: hash, organisation, phone });
        await newUser.save();

        await Otp.deleteOne({ email });

        const tokenData = await CreateUserToken(newUser._id, name, email);

        if (tokenData.status) {
            await Token.create({ userId: newUser._id, token: tokenData.token });

            res.cookie("jwt", tokenData.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            return res.status(201).json({ success: true, message: "User created successfully!", token: tokenData.token });
        } else {
            return res.status(500).json({ tag: "token", success: false, message: tokenData.message });
        }

    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal server error!", error: err.message });
    }
}

// -------------------------- for set user (Reset Password / Update Profile) -------------------------- //
const SetUser = async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        if (!email) return res.status(400).json({ tag: "email", success: false, message: "Email is required!" });
        if (!otp) return res.status(400).json({ tag: "otp", success: false, message: "OTP is required!" });
        if (!password) return res.status(400).json({ tag: "password", success: false, message: "Password is required!" });
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

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            user.attempts -= 1;
            await user.save();
            if (user.attempts === 0) {
                await User.updateOne({ email }, { lockedUntil: Date.now() + 24 * 60 * 60 * 1000, status: "LOCKED" });
                return res.status(403).json({ success: false, message: "Your account is locked for 24 hours!" });
            }
            return res.status(400).json({ success: false, message: `Invalid Password! ${user.attempts} attempts left.` });
        }

        await Otp.deleteOne({ email });

        const tokenData = await CreateUserToken(user._id, user.name, user.email);
        if (tokenData.status) {
            // Upsert operation safely handles updating or creating tokens smoothly
            await Token.findOneAndUpdate(
                { userId: user._id },
                { token: tokenData.token },
                { upsert: true, new: true }
            );

            res.cookie("jwt", tokenData.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            return res.status(200).json({
                success: true,
                message: "User logedin successfully!",
                token: tokenData.token,
                name: user.name,
                email: user.email
            });
        } else {
            return res.status(500).json({ tag: "token", success: false, message: tokenData.message });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal server error!" });
    }
}

// -------------------------- for send otp to the provided email -------------------------- //
const SendEmailOTP = async (req, res) => {
    try {
        const { email, tag } = req.body;
        if (!email) return res.status(400).json({ tag: "email", success: false, message: "Email is required!" });
        if (!tag) return res.status(400).json({ tag: "tag", success: false, message: "Tag is required!" });
        if (!isValidEmail(email)) return res.status(400).json({ tag: "email", success: false, message: "Invalid email!" });

        const userData = await User.findOne({ email });

        // Check if user is locked
        if (userData && userData.lockedUntil != null) {
            const timeRemains = userData.lockedUntil - new Date();
            const timeInMinutes = timeRemains / 1000 / 60;
            if (timeInMinutes > 0) {
                return res.status(403).json({ success: false, message: `Account is locked! try again after ${timeInMinutes} minutes.` });
            }
            await User.updateOne({ email }, { lockedUntil: null, attempts: 3, status: "ACTIVE" });
        }
        if (userData && userData.status == "LOCKED") return res.status(403).json({ success: false, message: "Account is locked! try again after some time." });

        if (tag === "signup" && userData) {
            return res.status(400).json({ tag: "email", success: false, message: "User already exists with this email!" });
        } else if (tag === "login" && !userData) {
            return res.status(400).json({ tag: "email", success: false, message: "User not found with this email!" });
        } else if (tag !== "signup" && tag !== "login") {
            return res.status(400).json({ tag: "tag", success: false, message: "Invalid tag!" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const expirationTime = Date.now() + 10 * 60 * 1000;

        // FIX: Added 'exp' to new OTP records so validation doesn't break later
        await Otp.findOneAndUpdate(
            { email },
            { otp, exp: expirationTime },
            { upsert: true, new: true }
        );

        const otpRes = await SendEmail(email, otp, tag);
        if (!otpRes.status) return res.status(500).json({ success: false, message: otpRes.message });
        return res.status(200).json({ success: true, message: "OTP sent successfully!" });

    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal server error!" });
    }
}

module.exports = { CreateUser, SetUser, SendEmailOTP };
