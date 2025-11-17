const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const Notes = require('../../models/notesModel');
const Assessments = require('../../models/assessmentsModel');

const editUser = async (req,res) => {
    const { firstname,lastname,password = 'Any'} = req.body;
    const userID = req.user.userId;
    try {
        const query = {};

        if(firstname && firstname !== 'Any') {
            query.firstname = firstname;
        }
        if(lastname && lastname !== 'Any') {
            query.lastname = lastname;
        }

        if(password && password !== 'Any') {
            const hashedPassword = await argon2.hash(password, {
                timeCost:1,
                memoryCost:2 ** 12,
                parallelism,
            });
            query.password = hashedPassword;
        }

        if(req.file) {
            query.profileImage = {
                public_id: req.file.filename,
                url:req.file.path,
            };

            const updatedUser = await User.findOneAndUpdate(
                {_id:userID},
                {$set: query},
                {new:true,upsert:false}
            );

            if(!updatedUser) {
                return res.status(404).json({message: "User not found!"});
            }

            const accessToken = jwt.sign(
                {
                    userId:updatedUser._id,
                    firstname:updatedUser.firstname,
                    lastname:updatedUser.lastname,
                    email:updatedUser.email,
                    role:updatedUser.role,
                    profileImage:updatedUser.profileImage?.url || null
                },
                process.env.JWT_SECRET,
                {expiresIn: '15m'}
            );

            if(query.firstname || query.lastname) {
                const notesUploadedByUserExists = await Notes.find({uploaderId: userID});
                if(notesUploadedByUserExists.length > 0){
                    await Notes.updateMany(
                        {uploaderId: userID},
                        {uploaderName: updatedUser.firstname + ' ' + updatedUser.lastname}
                    );
                }

                const assessmentsUploadedByUserExists = await Assessments.find({
                    uploaderId: userID
                });
                if(assessmentsUploadedByUserExists.length > 0) {
                    await Assessments.updateMany(
                        {uploaderId: userID},
                        {uploaderName: updatedUser.firstname + ' ' +updatedUser.lastname}
                    );
                }
            } 
            return res.status(200).json({
                message:"User updated successfully",
                accessToken,
                profileImage: updatedUser.profileImage || null,
                updatedUser
            });
        }
    } catch(error) {
                console.error(error);
                return res.status(500).json({message:"Server error"});
    } 
};

module.exports = editUser;