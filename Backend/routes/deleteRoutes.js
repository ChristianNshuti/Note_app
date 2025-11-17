const express = require('express');
const router = express.Router();

const verify = require('../middlewares/verify');

const {deleteNote} = require('../controllers/deleteNoteController');
const { deleteAssessment } = require("../controllers/deleteAssessmentController");

router.delete('/deleteNote',verify,deleteNote);
router.delete('/deleteAssessment',verify,deleteAssessment);

module.exports = router;