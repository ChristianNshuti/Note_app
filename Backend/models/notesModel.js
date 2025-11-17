const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    uploaderId: {type:String, required:true},
    uploaderName: {type:String,required:true},
    grade: {type:Number,required:true,enum:[1,2,3]},
    lesson:{type:String,required:true},
    noteName: {type:String,required:true},
    type:{type:String,default:"Notes",enum:["Notes"]},
    descritpion:{type:String,required:true},
    fileUrl:{type:String,required:true},
    publicId:{type:String},
    fileSize:{type:Number},
},{ timestamps:true });

noteSchema.index({grade: 1,lesson: 1,createdAt: -1});
noteSchema.index({uploaderId:1,createdAt:-1});
noteSchema.index({createdAt:-1});
noteSchema.index({_id:1,uploaderId:1});

module.exports = mongoose.model('notes',noteSchema);