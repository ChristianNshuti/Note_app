const express = require("express");
const router = express.Router();
const verify = require('../middlewares/verify');
const {getProfileImages} = require('../controllers/profileImageController');


router.get("/:userId/profile-image",verify,getProfileImages);

router.post("/profile-images",verify,getProfileImages);

module.exports = router;