const User = require('../models/user');

const getProfileImages = async(req,res) => {
    try {
        let userIds = req.body?.userIds;

        if(!userIds && req.params.userId) userIds = [req.params.userId];

        if(!userIds || userIds.length ===0) {
            return res.status(400).json({message:"No user IDs provided"});
        }
        const users = await User.find({_id: {$in:userIds}}).select("profileImage profilePicture firstname lastname");

        const result = users.map(user => ({
            userId:user._id,
            name:`${user.firstname} ${user.lastname}`,
            profileImage:user.profileImage?.url || user.profilePicture || null
        }));

        return res.json(result);
    } catch(error) {
        console.error("Error fetching profile images:",error);
        return res.status(500).json({message:"Server error"});
    }
};

module.exports = { getProfileImages };