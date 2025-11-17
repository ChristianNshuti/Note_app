const express = require('express');
const mongoose = require('mongoose');

const savedSchema = new mongoose.Schema({
    document_id:{type:mongoose.Schema.Types.ObjectId,required:true},
    type:{type:String,ENUM:['Assessments','Notes'], required:true},
    saver_id:{type:String},
},{ timestamps:true })

savedSchema.index({type:1,saver_id:1});
savedSchema.index({document_id:1});

module.exports = mongoose.model("Saveds",savedSchema)