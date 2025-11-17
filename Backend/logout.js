const express = require('express')
const mongoose = require('mongoose')

const logout = async(req,res) => {
    res.clearCookie('refreshToken');
    res.status(200).json({message:"Logged out successfully"})
}

module.exports = logout;