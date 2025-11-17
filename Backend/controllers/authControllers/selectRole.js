const jwt  = require('jsonwebtoken');
const Users = require('../../models/user');

const selectRole = async (req,res) => {
    try {
        const {email,role:selectedRole} = req.body;

        if(!email || !selectedRole) {
            return res.status(400).json({error: 'Missing email or selected role'});
        }

        const user = await Users.findOne({email});
        if(!user) {
            return res.status(404).json({error:'User not found'});
        }

        console.log(user.role + 'these are the roles in db');

        if(!user.role.includes(selectedRole)) {
            return res.status(400).json({error: 'Invalid role selected'});
        }

        const accessTokenPayload = {
            userId: user._id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            role: selectedRole,
            courses: user.courses,
        };

        const accessToken = jwt.sign(accessTokenPayload,process.env.JWT_SECRET, {expiresIn:'15m'});
        const refreshToken = jwt.sign({userId: user._id,role: selectedRole}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});

        res.cookie('refreshToken',refreshToken, {
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            expires: new Date(Date.now() + 7 * 24 *60 *60 * 1000),
        });

        console.log('This is the accessToken',accessToken + 'and with refreshToken' + refreshToken);

        res.status(200).send({'accessToken':accessToken})
    } catch(err) {
        console.error('Error in selectRole:', err.message);
        res.status(500).json({error: 'Internal server error'});
    }
};

module.exports = selectRole;