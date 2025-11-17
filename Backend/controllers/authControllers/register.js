const Users = require('../../models/user');
const argon2 = require('argon2');

// New registration flow:
// - Accepts username, email, password, role ("student" or "teacher")
// - Does NOT check Excel files
// - Does NOT send verification emails
// - Creates the user directly in the database
// - Returns a simple success message (frontend will redirect to home)
const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required (username, email, password, role).' });
    }

    const normalizedEmail = email.toLowerCase();

    const existingUser = await Users.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(200).json({ message: 'User already registered' });
    }

    if (!['student', 'teacher'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role selected. Choose either student or teacher.' });
    }

    const hashedPassword = await argon2.hash(password, {
      timeCost: 1,
      memoryCost: 2 ** 12,
      parallelism: 1,
    });

    const newUser = new Users({
      username,
      email: normalizedEmail,
      password: hashedPassword,
      role: [role],
      courses: [],
    });

    await newUser.save();

    return res.status(201).json({ message: 'Registration successful. You can now log in.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = register;