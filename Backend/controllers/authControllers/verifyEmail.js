const jwt = require('jsonwebtoken');
const Users = require('../../models/user');
const argon2 = require('argon2');

const verifyEmail = async (req, res) => {
    const { token } = req.query;

    if (!token) return res.status(400).send('Invalid verification link');

    try {
        // Decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email, password } = decoded;

        // Check if user already exists
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(409).send('User already verified');
        }

        // Hash password
        const hashedPassword = await argon2.hash(password, {
            timeCost: 1,
            memoryCost: 2 ** 12,
            parallelism: 1,
        });

        // Create new user with default role
        const newUser = new Users({
            email,
            password: hashedPassword,
            role: "student",        // you can change this
            verified: true,
            courses: [],            // empty since no Excel now
        });

        await newUser.save();

        // Create access token
        const accessToken = jwt.sign(
            {
                userId: newUser._id,
                email: newUser.email,
                role: newUser.role,
                courses: newUser.courses,
            },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Create refresh token
        const refreshToken = jwt.sign(
            { userId: newUser._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        // Set refresh token cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        // Redirect to frontend after successful verification
        return res.redirect(
            `https://localhost:5173/?token=${encodeURIComponent(accessToken)}&verify=true`
        );

    } catch (err) {
        console.error('Error in verifyEmail:', err.message);
        return res.status(400).send(`Invalid or expired token: ${err.message}`);
    }
};

module.exports = verifyEmail;
