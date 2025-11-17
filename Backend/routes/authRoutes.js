const express = require('express');
const router = express.Router();

const logout = require('../controllers/authControllers/logout');
const login =require('../controllers/authControllers/login');
const register = require('../controllers/authControllers/register');
const check = require('../controllers/authControllers/check');
const editUser = require('../controllers/authControllers/editUser');
const resetPassword = require('../controllers/authControllers/resetPassword');
const forgotPassword = require('../controllers/authControllers/forgotPassword');
const renewAccessToken = require('../controllers/authControllers/renewAccessToken');
const verifyEmail = require('../controllers/authControllers/verifyEmail');
const selectRole = require('../controllers/authControllers/selectRole');
const getAvailableRoles = require('../controllers/authControllers/getAvailableRoles');
const { uploadProfileImage } = require('../middlewares/multerConfig');
const verify = require('../middlewares/verify');

function multerErrorHandler(err,req,res,next) {
    if(err) {
        return res.status(400).json({message:err.message});
    }
    next();
}

router.post('/register',register);
router.get('/check',verify,check);
router.post('/login',login);
router.post('/logout',logout);
router.post('/updateUser',verify,uploadProfileImage.single('file'),multerErrorHandler,editUser);
router.post('/resetPassword',resetPassword);
router.post('/forgotPassword',forgotPassword);
router.post('/renewAccessToken',renewAccessToken);
router.get('/verifyEmail',verifyEmail);
router.post('/select-role',selectRole);
router.post('/getAvailableRoles',getAvailableRoles);

module.exports = router;
