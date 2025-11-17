const express = require('express');
const mongoose = require('mongoose');
const saved = require('../../models/savedModel');

const removeSave = async (req,res) => {
    const { document_id,type } = req.body;
    const saver_id = req.user.userId;
    try {
        if(!document_id && !type) {
            return res.status(400).json({message:"Document id and type are required"});
        }

        const deleted = await saved.findOneAndDelete({document_id,type,saver_id});
        if(!deleted) {
            return res.status(404).json({message:'Document not found in saved list'});
        }

        return res.status(200).json({message:"Deleted successfully"})
    } catch(error) {
        console.log(error.message);
        return res.status(500).json({message:error.message});
    }
}

module.exports = removeSave;