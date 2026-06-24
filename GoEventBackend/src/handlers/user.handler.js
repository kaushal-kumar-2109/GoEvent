const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');

const User = require("../../db/models/user.model.js");
const Otp = require("../../db/models/otp.model.js");
const Token = require("../../db/models/token.model.js");

const CreateUserToken = require("../utils/createToken.js");
const SendEmail = require("../utils/sendOtp.js");

// ------------------------- for creating user -------------------------
const CreateUser = async (req, res) => {
    try {
        const { name, email, password, otp, organisation, phone } = req.body;
        if (!name || !email || !password || password.length < 8 || !otp || !phone || !organisation) {
            if (!name) return res.status(400).json({ tag: "name", success: false, message: "Name is required!" });
            if (!email) return res.status(400).json({ tag: "email", success: false, message: "Email is required!" });
            if (!password) return res.status(400).json({ tag: "password", success: false, message: "Password is required!" });
            if (!phone) return res.status(400).json({ tag: "phone", success: false, message: "Phone is required!" });
            if (!organisation) return res.status(400).json({ tag: "organisation", success: false, message: "Organisation is required!" });
            if (password.length < 8) return res.status(400).json({ tag: "password", success: false, message: "Password must be at least 8 characters long!" });
            if (!otp) return res.status(400).json({ tag: "otp", success: false, message: "OTP is required!" });
        }
        if (!email.includes("@") || !email.includes(".")) return res.status(400).json({ tag: "email", success: false, message: "Invalid email!" });

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ tag: "email", success: false, message: "User already exists!" });

        const otpData = await Otp.findOne({ email });
        if (!otpData) return res.status(400).json({ tag: "otp", success: false, message: "OTP Expired or not found!" });
        if (parseInt(otpData.otp) !== parseInt(otp)) return res.status(400).json({ tag: "otp", success: false, message: "Invalid OTP!" });
        if (otpData.exp < Date.now()) return res.status(400).json({ tag: "otp", success: false, message: "OTP Expired!" });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, password: hash, organisation, phone });
        await newUser.save();

        await Otp.deleteOne({ email });

        const tokenData = await CreateUserToken(newUser._id, name, email);
        if (tokenData.status) {
            const newToken = new Token({ userId: newUser._id, token: tokenData.token });
            await newToken.save();

            res.cookie("jwt", tokenData.token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            return res.status(201).json({ success: true, message: "User created successfully!", token: tokenData.token });
        } else {
            return res.status(500).json({ tag: "token", success: false, message: tokenData.message });
        }

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error!",
            error: err
        });
    }
}


// -------------------------- for set user -------------------------- //
const SetUser = async (req, res) => {
    try {
        const { email, otp, password } = req.body;
        if (!email || !otp || !password) {
            if (!email) return res.status(400).json({ tag: "email", success: false, message: "Email is required!" })
            if (!otp) return res.status(400).json({ tag: "otp", success: false, message: "OTP is required!" })
            if (!password) return res.status(400).json({ tag: "password", success: false, message: "Password is required!" })
        }
        if (!email.includes("@") || !email.includes(".")) return res.status(400).json({ tag: "email", success: false, message: "Invalid email!" })
        if (password.length < 8) return res.status(400).json({ tag: "password", success: false, message: "Password must be at least 8 characters long!" })

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ tag: "email", success: false, message: "User not found with this email!" })

        const otpData = await Otp.findOne({ email });
        if (!otpData) return res.status(400).json({ tag: "otp", success: false, message: "OTP Expired or not found!" });
        if (parseInt(otpData.otp) !== parseInt(otp)) return res.status(400).json({ tag: "otp", success: false, message: "Invalid OTP!" });
        if (otpData.exp < Date.now()) return res.status(400).json({ tag: "otp", success: false, message: "OTP Expired!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ tag: "password", success: false, message: "Invalid Password!" });

        await Otp.deleteOne({ email });

        const tokenData = await CreateUserToken(user._id, user.name, user.email);
        if (tokenData.status) {
            const oldToken = await Token.findOne({userId:user._id});
            if(oldToken){
                const resToken = await Token.updateOne({ userId: user._id }, { token: tokenData.token });
            }else{
                const newToken = new Token({ userId:user._id, token: tokenData.token });
                await newToken.save();
            }
            res.cookie("jwt", tokenData.token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            return res.status(201).json({ success: true, message: "User set successfully!", token: tokenData.token });
        } else {
            return res.status(500).json({ tag: "token", success: false, message: tokenData.message });
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error!"
        });
    }
}

// -------------------------- for send otp to the provided email -------------------------- //
const SendEmailOTP = async (req, res) => {
    try {
        const { email, tag } = req.body;
        if (!email || !tag) {
            if (!email) return res.status(400).json({ tag: "email", success: false, message: "Email is required!" });
            if (!tag) return res.status(400).json({ tag: "tag", success: false, message: "Tag is required!" });
        }
        if (!email.includes("@") || !email.includes(".")) return res.status(400).json({ tag: "email", success: false, message: "Invalid email!" });

        const userData = await User.findOne({ email });
        if (tag == "signup") {
            if (userData) return res.status(400).json({ tag: "email", success: false, message: "User already exists with this email!" });
        }
        else if (tag == "login") {
            if (!userData) return res.status(400).json({ tag: "email", success: false, message: "User not found with this email!" });
        }
        else {
            return res.status(400).json({ tag: "tag", success: false, message: "Invalid tag!" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpData = await Otp.findOne({ email });
        if (otpData) {
            await Otp.updateOne({ email }, { otp });
        } else {
            const newOtp = new Otp({ email, otp });
            await newOtp.save();
        }

        const otpRes = await SendEmail(email, otp, tag);
        if (!otpRes.status) return res.status(500).json({ success: false, message: otpRes.message });
        return res.status(200).json({ success: true, message: "OTP sent successfully!" });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error!"
        });
    }
}

module.exports = { CreateUser, SetUser, SendEmailOTP };