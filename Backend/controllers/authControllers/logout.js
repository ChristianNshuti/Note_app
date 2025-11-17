const express = require('express');
const mongoose = require('mongoose');


//To be deleted instead i will delete the accessToken and refreshToken on the frontend by localStorage
const logout = async(req,res) => {
    res.clearCookie('refreshToken');
    res.status(200).json({message:"Logged out successfully!"})
}

module.exports = logout;