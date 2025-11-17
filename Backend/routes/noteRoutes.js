const express = require('express')
const router = express.Router();

const verify = require('../middlewares/verify');

const {getNotes} = require('../controllers/noteController');

router.post('/',verify,getNotes);

module.exports = router;