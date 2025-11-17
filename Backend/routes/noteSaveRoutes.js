const express = require('express');
const router = express.Router();

const verify = require('../middlewares/verify');

const save = require('../controllers/SaveControllers/save');
const getSavedNotes = require('../controllers/SaveControllers/getSavedNotes');
const getSavedAssessments = require('../controllers/SaveControllers/getSavedAssessments');
const removeSave = require('../controllers/SaveControllers/removeSave');

router.post('/save',verify,save);
router.get('/getSavedNotes',verify,getSavedNotes);
router.get('/getSavedAssessments',verify,getSavedAssessments);
router.post('/removeSave',verify,removeSave);

module.exports = router;