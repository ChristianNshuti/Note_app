const express = require('express')
const mongoose = require('mongoose')
const saved = require('../../models/savedModel')

const save = async(req,res) => {
    const {document_id,type} = req.body;
    const saver_id = req.user.userId;
    try {
        const saveExists = await saved.findOne({document_id,type,saver_id});
        if(!saveExists) {
            await saved.create({document_id,saver_id,type});
            return res.status(201).json({message:"Saved successfully"});
        }
        return res.status(400).json({message:"already saved"});
    } catch(error){
        console.log(error.message);
        return res.status(500).json({message:error.message});
    }
}

module.exports = save;