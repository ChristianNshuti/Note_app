const Assessments = require('../models/assessmentsModel');
const cloudinary = require('cloudinary').v2;

const updateAssessment = async(req,res) => {
    const {AssessmentId,description} = req.body;
    const fileUrl = req.file?.path;
    const publicId = req.file?.filename;
    try {
        if(req.user.role === "teacher") {
            const oldAssessment = await Assessments.findById({_id:AssessmentId});
            const oldPId = oldAssessment.publicId;

            if(oldPId) {
                const result = cloudinary.uploader.destroy(oldPId,{resource_type:'raw'})
                                .then(result => console.log("Cloudinary delete result:",result))
                                .catch(err => console.error("Cloudinary delete error:",err));
            } else {
                console.log("Invalid file URL - couldn't extract public ID.");
            }
            const newAssessment = await Assessments.findOneAndUpdate({_id:AssessmentId},{description,fileUrl,publicId},{new:true});

            return res.status(200).json({message:"Updated successfully", newAssessment});
        }
        else {
            return res.status(401).json({message:"Not allowed"});
        }
    } catch(error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"})
    }
}

    module.exports = {updateAssessment}