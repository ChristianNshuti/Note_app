const express = require('express')
const mongoose = require('mongoose')

const registerFailure = (req,res) => {
    try {
        res.send("User already register!");
    } catch(error) {
        res.status(400).json({message:error.message});
    }
}

module.exports = registerFailure