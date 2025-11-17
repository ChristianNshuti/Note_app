const Assessments = require('../models/assessmentsModel');
const Note = require('../models/notesModel');

const saveAndUpload = async (req,res) => {
    const userID = req.user.userId;
    const username = req.user.username;
    const publicId = req.file.filename;

    try {
        const {type,name,grade,lesson,documentName,description,term,category,year} = req.body;
        if(!req.file) {
            return res.status(400).json({message: "No file uploaded"});
        }

        if(type == 'Notes') {
            const NoteTrack = {
                uploaderId:userID,
                uploaderName:username,
                grade:grade,
                lesson:lesson,
                noteName:name,
                description:description,
                fileUrl:req.file.path,
                publicId,
                fileSize:req.file.size,
            }

            await Note.create(NoteTrack);
            return res.status(201).json({message:"Note uploaded to notely! Thanks for your contribution"});
        } else if(type == 'Assessments') {
            const AssessmentsTrack = {
                uploaderId: userID,
                uploaderName:username,
                grade:grade,
                lesson:lesson,
                term:term,
                year:year,
                category:category,
                assessmentName:name,
                description:description,
                fileUrl:req.file.path,
                publicId,
                fileSize:req.file.size,
            }

            await Assessments.create(AssessmentsTrack);
            return res.status(201).json({message:"New Assessment added! Thanks for your contribution"});
        } else {
            return res.status(400).json({message:"Invalid type"})
        }
    }catch(error) {
        return res.status(500).json({message:error.message});
    }
}

module.exports = { saveAndUpload };