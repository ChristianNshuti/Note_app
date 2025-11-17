const express = require('express');
const mongoose = require('mongoose');

const loginFailure = (req,res) => {
    try {
        res.send("User not found");

    }catch(error) {
        res.status(400).json({message:error.message});
    }
}

module.exports = loginFailure