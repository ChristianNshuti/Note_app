const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const verify = async (req,res,next) => {
    try {   
        const authHeader = req.headers['authorization'];

        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({message:"Header is empty or malformed"});
        }

        const token = authHeader.split(' ')[1];

        if(!token) {
            return res.status(401).json({message:"No token provided"})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        req.user = decoded;
        next();
    }   catch(error)  {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message:"Token expired",
                tokenExpired:true
            });
        }

        return res.status(401).json({message:"Invalid or expired token", tokenExpired:false,authenticated:false});
    }
}

module.exports = verify;