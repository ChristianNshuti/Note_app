const Note = require('../models/notesModel');

const getNotes = async (req,res) => {
    try {
        const {year,subject,recentOnes} = req.body;
        const uploaderId = req.user.userId;

        if(recentOnes) {
            const [notes,userUploads] = await Promise.all([
                Note.find({}).sort({createdAt:-1}),
                Note.find({uploaderId}).sort({createdAt:-1})
            ]);
        return res.status(200).json({success:true,notes,userUploads});
        }

        if(!year || !subject) {
            return res.status(400).json({success:false,message:'Year and subject are required'});
        }

        const notes = await Note.find({grade:year,lesson:subject})
                            .sort({createdAt: -1});
        return res.status(200).json({success:true,notes});
    } catch(error) {
        console.log('Error fetching notes:',error.message);
        return res.status(500).json({success:false,message:error.message});
    }
};

module.exports = { getNotes };