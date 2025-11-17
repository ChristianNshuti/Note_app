const Assessments = require('../models/assessmentsModel');

const getAssessments = async(req,res) => {
    try {
        const {grade,subject,recentOnes} = req.body;
        const uploaderId = req.user.userId;

        if(recentOnes) {
            const [assessments,userUploads] = await Promise.all([
                Assessments.find({}).sort({createdAt: -1}),
                Assessments.find({uploaderId}).sort({createdAt:-1})
            ])
            return res.status(200).json({success:true,assessments,userUploads});
        }

        if(!grade || !subject) {
            return res.status(400).json({ success:false,message:'Grade and subject are required'});
        }

        const assessments = await Assessments.find({grade:grade,lesson:subject});
        return res.status(200).json({success:true,assessments});
    } catch(error) {
        console.error('Error fetching Assessments:',error.message);
        return res.status(500).json({success:false,message:'Server error'});
    }
};

module.exports = { getAssessments };