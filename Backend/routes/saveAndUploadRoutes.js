const express = require('express');
const router = express.Router();

const {upload} = require('../middlewares/multerConfig');
const verify = require('../middlewares/verify');

const { saveAndUpload } = require('../controllers/uploadController');

function multerErrorHandler(err,req,res,next) {
    if(err) {
        return res.status(400).json({message:err.message});
    }
    next();
}

router.post('/',verify,upload.single("file"),multerErrorHandler,saveAndUpload);

module.exports = router;