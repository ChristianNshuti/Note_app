const multer = require('multer');
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require('cloudinary').v2;
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname,'../.env')});

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
});
const storage = new CloudinaryStorage({

    cloudinary: cloudinary,
    params:async(requestAnimationFrame,file) => {
        return {
            folder: "Notely",
            resource_type:"raw",
            type:"upload",
            filename_override: file.originalname,
        };
    }
})

const upload = multer({storage});

const profileImageStorage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params: async(req,file) => {
        return {
            folder:"Notely/ProfileImages",
            resource_type:"image",
            public_id:file.originalname.split('.')[0],
            allowed_formats: ['jpg','jpeg','png','webp']
        };
    }
});

const uploadProfileImage = multer({storage: profileImageStorage});

module.exports = { upload,uploadProfileImage };