const express = require('express')
const User = require('../../models/user');
const crypto = require('crypto')
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const forgotPassword = async(req,res) => {
    const {email} = req.body;
    
    try{
        const user = await User.findOne({email});
        if(!user) return res.status(404).json({message:"User not found"});

        const token = crypto.randomBytes(32).toString('hex');
        const expiry = Date.now() + 1000 * 60 *15;

        user.resetPasswordToken = token;
        user.resetPasswordExpires = expiry;
        await user.save();

        const htmlTemplatePath = path.join(__dirname, '../../templates/Reset.html');
        let html = fs.readFileSync(htmlTemplatePath, 'utf8');

        const resetLink = `http://10.12.74.242:5173/resetpassword/${token}`;
        html = html.replace('{{reset_link}}', resetLink);

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user:process.env.APP_EMAIL,
                pass:process.env.APP_KEY,
            },
        });

        await transporter.sendMain({
            from: 'Rwanda Coding Academy',
            to: user.email,
            subject: 'Reset your password',
            html,
        });

        return res.status(200).json({message: 'Reset link sent to email'});

     } catch(error) {
        return res.status(500).json({message: 'Server error'});
     }
};

module.exports = forgotPassword;