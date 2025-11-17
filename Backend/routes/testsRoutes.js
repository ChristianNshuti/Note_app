const express = require('express');
const router = express.Router();

const verify = require('../middlewares/verify');

const { getAssessments } = require('../controllers/testController');

router.post('/',verify,getAssessments);

module.exports = router;