const cloudinary = require("cloudinary").v2;

const cloudynaryConfig = async = () => {
    try {
        // ------------------------- Cloudynary configration ------------------------- //
        cloudinary.config({
            cloud_name: process.env.CLOUDYNARY_CLOUD_NAME,
            api_key: process.env.CLOUDYNARY_API_KEY,
            api_secret: process.env.CLOUDYNARY_SECRET
        });
        console.log("Cloudinary connected succesfully!");
    } catch (err) {
        console.log("Error in connecting cloudinary => ", err);
    }
}

cloudynaryConfig();