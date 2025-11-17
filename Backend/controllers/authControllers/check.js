const express = require('express');
const mongoose = require('mongoose');
const verify = require('../../middlewares/verify');
const jwt = require('jsonwebtoken');



const check = async (req,res) => {
    if(req.user) {
        return res.status(200).json({
            authenticated:true,
            user:req.user
        });
    } else {
        return res.status(401).json({
            authenticated: false,
            message:"User not authenticated"
        });
    }
};

module.exports = check;