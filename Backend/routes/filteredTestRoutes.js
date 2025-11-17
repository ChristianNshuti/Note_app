const express = require('express');
const router = express.Router();

const verify = require('../middlewares/verify');

const { getFilteredTest } = require('../controllers/filteredTestControllers');

router.post('/',verify,getFilteredTest);

module.exports = router;