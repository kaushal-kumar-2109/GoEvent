const jwt = require("jsonwebtoken");

const CreateToken = async (userData) => {

    try {
        const userPayload = {
            _id: userData._id,
            name: userData.name,
            email: userData.email,
            role: userData.role
        }
        // Generate the token
        const privateKey = process.env.JWT_SECRET;
        const algorithm = process.env.ALGORITHM;
        const expiresIn = "7d";
        const token = jwt.sign(userPayload, privateKey, { algorithm, expiresIn });

        return ({ status: true, message: "Token created successfully ", token });
    } catch (err) {
        console.log("there is the token creating error ", err);
        return ({ status: false, message: "Error in creating token ", error: err });
    }
}

const VerifyToken = async (token) => {

    try {
        const privateKey = process.env.JWT_SECRET;
        const algorithm = process.env.ALGORITHM;

        const userPayload = jwt.verify(token, privateKey, {
            algorithms: [algorithm]
        });

        return ({ status: true, message: "Token verified successfully ", userPayload });
    } catch (err) {
        return ({ status: false, message: "Error in creating token ", error: err });
    }
}

module.exports = { VerifyToken, CreateToken };