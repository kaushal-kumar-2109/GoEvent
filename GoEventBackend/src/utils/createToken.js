const jwt = require("jsonwebtoken");

const CreateUserToken = async (uid, name, email) => {

    // The payload (data you want to securely store in the token)
    const userPayload = {
        userId: uid,
        role: 'USER',
        name: name,
        email: email,
    };
    try {
        // Generate the token
        const secretKey = process.env.JWT_SECRET;
        const token = jwt.sign(userPayload, secretKey, { expiresIn: '7d' });
        return ({ status: true, message: "Token created successfully ", token: token });
    } catch (err) {
        return ({ status: false, message: "Error in creating token ", error: err });
    }
}

module.exports = CreateUserToken;