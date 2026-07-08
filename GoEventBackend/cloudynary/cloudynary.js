const cloudinary = require("cloudinary").v2;
const uuidV4 = require("uuid").v4;

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

const uploadFile = async (filePath) => {
    try {
        const uid = uuidV4();
        // ------------------------- Cloudynary upload file ------------------------- //
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            public_id: uid,
        });

        console.log("The uploaded result is => ", uploadResult.url);
        console.log("The public_id is => ", uid);

        return ({ status: true, message: 'File stored successfully!', data: uploadResult });
    } catch (err) {
        console.log("Error in uploading file => ", err);
        return ({ status: false, message: 'Failed to store file in cloudynary', info: err });
    }
}

module.exports = { cloudynaryConfig, uploadFile };