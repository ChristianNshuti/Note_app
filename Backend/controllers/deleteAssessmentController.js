const e = require('express');
const Assessments = require('../models/assessmentsModel');
const Saved = require('../models/savedModel');
const cloudinary = require('cloudinary').v2;

const deleteAssessment = async(req,res) => {
    const {AssessmentId,fileName} = req.body;
    const uploaderId = req.user.userId;
    const role = req.user.role;

    try {
        if(role === 'teacher') {
            const deleteAssessment = await Assessments.findOneAndDelete({_id:AssessmentId,uploaderId});

            if(!deleteAssessment) {
                return res.status(404).json({message:"Assessment not found!"})
            }

            if(fileName) {
                const result = cloudinary.uploader.destroy(fileName,{ resource_type: 'raw' })
                .then(result=>console.log("Cloudinary delete result:",result))
                .catch(err => console.error("Cloudinary delete error:",err));
            } else {
                console.log("Invalid file URL - couldn't extract public ID.");
            }

            const wasSaved = await Saved.find({document_id:AssessmentId});

            if(wasSaved) {
                await Saved.deleteMany({document_id:AssessmentId});
            }
            else {}
            return res.status(200).json({message:"Deletion successful"})
        } else {
            return res.status(403).json({message:"Forbidden!"})
        }
    }catch(error) {
        console.error("Delete error: ",error);
        return res.status(500).json({message:"Server error!"});
    }
}

module.exports = {deleteAssessment}