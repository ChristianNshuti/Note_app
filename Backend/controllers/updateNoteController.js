const Notes = require('../models/notesModel');
const cloudinary = require('cloudinary').v2;

const updateNote = async(req,res) => {
    const {noteId,description} = req.body;
    const fileUrl = req.file?.path;
    const publicId = req.file?.filename;

    try {
        if(req.user.role === "teacher") {
            const oldNote = await Notes.findById({_id:noteId});
            const oldPId = oldNote.publicId;

            if(oldPId) {
                const result = cloudinary.uploader.destroy(oldPId, { resource_type: 'raw' })
                                .then(result => console.log("Cloudinary delete result:",result))
                                .catch(err => console.error("Cloudinary delete error:",err));
            } else {
                console.log("Invalid file URL - couldn't extract public ID.");
            }
            const newNote = await Notes.findOneAndUpdate({_id:noteId},{description,fileUrl,publicId},{new:true});
            return res.status(200).json({message:"Updated successfully",newNote});
        } else {
            return res.status(401).json({message:"Not allowed"});
        }
    } catch(error) {
        console.log("Error: ",error);
        return res.status(500).json({message:"Internal server error"})
    }
}

module.exports = {updateNote}