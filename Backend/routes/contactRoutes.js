const express = require('express')
const router = express.Router();

const {getContacts} = require('../controllers/excelHandling');

router.get('/',getContacts);

module.exports = router;