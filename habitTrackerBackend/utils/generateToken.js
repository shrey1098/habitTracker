// /utils/generateToken.js
import jwt from 'jsonwebtoken';

// takes user ID return jwt valid for 7 days
const generateToken = (userId) => {
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {
        expiresIn: '7d'// token valid for 7 days
    });
};

export default generateToken