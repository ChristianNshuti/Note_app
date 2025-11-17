const jwt = require('jsonwebtoken');

const getAvailableRoles = (req,res) => {
    const {roleToken} = req.body;

    if(!roleToken) {
        return res.status(400).json({error: 'Token not provided'});
        console.log('Not provided');
    }

    try {
        const decoded = jwt.verify(roleToken,process.env.JWT_SECRET);
        const roles = decoded.roles;
        console.log(roles + 'these are the roles found');
        if(!roles || !Array.isArray(roles)) {
            return res.status(400).json({error: 'No roles found in token'});
        }

        return res.json({roles});
    } catch(error) {
        console.log('catch run instead'+err);
        return res.status(401).json({error:'Invalid or expired token'});
    }
};

module.exports = getAvailableRoles;