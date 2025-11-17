const Notes = require('../models/notesModel');
const Saved = require('../models/savedModel');
const cloudinary = require('cloudinary').v2;


const deleteNote = async(req,res) => {

    const uploaderId = req.user.userId;
    const role = req.user.role;
    const { noteId,fileName} = req.body;

    try {
        if(role === 'teacher') {
            const deleteNote = await Notes.findOneAndDelete({_id:noteId,uploaderId});

        if(!deleteNote) {
            return res.status(404).json({message:"Note not found!"});
        }

        if(fileName) {
            const result = cloudinary.uploader.destroy(fileName,{resource_type: 'raw'})
                .then(result => console.log("Cloudinary delete result:",result))
                .catch(err => console.error("Cloudinary delete error:",err));
        } else {
            console.log("Invalid file URL - couldn't extract public ID.");
        }

        const wasSaved = await Saved.find({document_id:noteId});

        if(wasSaved) {
            await Saved.deleteMany({document_id:noteId});
        } 
        else {}
        return res.status(200).json({message:"Deletion successful"});
    } else {
        return res.status(403).json({message:"Forbidden!"})
    }} catch(error) {
        console.error("Delete error: ",error);
        return res.status(500).json({message:"Server error!"});
    }
}

module.exports = {deleteNote}