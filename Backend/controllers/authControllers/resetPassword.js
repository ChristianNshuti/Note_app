const User = require('../../models/user');
const argon2 = require('argon2');

const resetPassword = async(req,res) => {
    const {token,newPassword} = req.body;

    if(!token || !newPassword) {
        return res.status(400).json({message:'Token and new password are required'});
    }

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: {$gt: Date.now()},
        });

        if(!user) {
            return res.status(400).json({message:"Invalid or expired token"});
        }

        const hashedPassword = await argon2.hash(newPassword, {
            timeCost: 1,
            memoryCost: 2 ** 12,
            parallelism: 1,
        });

        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        await user.save();

        return res.status(200).json({message:'Password changed successfully!'});
    } catch(error) {
        return res.status(500).json({message:'Error resetting password'});
    }
};

module.exports = resetPassword;