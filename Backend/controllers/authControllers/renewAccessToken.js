const jwt = require('jsonwebtoken')
const User = require('../../models/user');

const renewAccessToken = async (req,res) => {
    const refreshToken = req.cookies?.refreshToken;

    try{
        if(!refreshToken) {
            return res.status(404).json({message:"No token found",authenticated:false,tokenExpired:true})
        }
        else {
            const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
            const userInfo = await User.findById(decoded.userId);

            if(!userInfo) {
                return res.status(404).json({message:"User not found!"})
            }

            const accessTokenPayload = {
                userId: userInfo._id,
                email: userInfo.email,
                username: userInfo.username,
                role:decoded.role,
                courses:userInfo.courses
            }
            const accessToken = jwt.sign(accessTokenPayload,process.env.JWT_SECRET,{expiresIn:"15m"});
            return res.status(200).json({accessToken})
        }
    } catch(error) {
        console.log("Token renewal error: ",error.message);
        return res.status(401).json({message:"Refresh token expired or is invalid!",tokenExpired:true,authenticated:false})
    }
}

module.exports = renewAccessToken;