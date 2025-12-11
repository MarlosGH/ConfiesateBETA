const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// CONFIG CLOUDINARY
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// STORAGE PARA MULTER
const storage = new CloudinaryStorage({
    cloudinary,
    params: (req, file) => {
        return {
            folder: "confiesate",
            allowed_formats: ["jpg", "jpeg", "png", "gif", "mp4", "webm", "ogg", "mkv"],
            public_id: Date.now() + "-" + file.originalname
        };
    }
});

module.exports = { cloudinary, storage };