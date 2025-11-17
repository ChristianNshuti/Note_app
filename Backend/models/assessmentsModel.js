const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    uploaderId:String,
    uploaderName:String,
    grade:{type:Number,require:true,enum: [1,2,3]},
    lesson:{type:String,require:true},
    term:{type:Number,enum:[1,2,3]},
    category:{type:String,enum:['Examination','CAT']},
    year:{type:Number},
    assessmentName:String,
    type:{type:String,default:"Assessments",enum: ["Assessments"]},
    description: {type:String,required:true},
    fileUrl:{type:String,required:true},
    publicId:{type: String},
    fileSize:{type:Number},
},{timestamps:true});

assessmentSchema.index({grade: 1,lesson:1});
assessmentSchema.index({grade: 1,lesson: 1,term:1,category:1,year:1});
assessmentSchema.index({uploader:1,createdAt: -1});
assessmentSchema.index({createdAt: -1});
assessmentSchema.index({ _id:1,uploaderId:1});

module.exports = mongoose.model('Assessments',assessmentSchema);