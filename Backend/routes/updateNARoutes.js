const express = require('express');
const router = express.Router();

const { upload } = require('../middlewares/multerConfig');
const verify = require('../middlewares/verify');

const {updateNote} = require('../controllers/updateNoteController');
const {updateAssessment} = require('../controllers/updateAssessmentsController');

function multerErrorHandler(err,req,res,next) {
    if(err) {
        return res.status(400).json({message: err.message});
    }
    next();
}

router.put('/updateNote',verify,upload.single("file"),multerErrorHandler,updateNote);
router.put('/updateAssessment',verify,upload.single("file"),multerErrorHandler,updateAssessment);

module.exports = router;