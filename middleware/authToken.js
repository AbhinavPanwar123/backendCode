const JWT = require('jsonwebtoken');
const userSchema = require('../models/user'); // Ensure you have imported the userSchema


const generateToken = (userId) => {
    return JWT.sign(
        {userId},
        "mysecretkey",
        {expiresIn:'4d'}
    )
};


const verifyToken = async (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        const decoded = JWT.verify(token, "mysecretkey");
        req.user = await userSchema.findById(decoded.userId).select('-password');
        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
  
  module.exports = { generateToken, verifyToken };