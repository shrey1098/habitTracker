// controllers/authController.js

import User from '../models/user.js';                // mondoDB user model
import bcrypt from 'bcryptjs';                      // for hashing passwords
import generateToken from '../utils/generateToken.js'; // JWT generator



// -------------------------------------------REGISTER CONTROLLER---------------------------------------------------
export const registerUser = async (req, res) => {
    console.log('Registering user...' + req.body); // log for debugging
    try{
        const {username, email, password} = req.body;                           // destructure request body
        // 1. Check if user already exists
        const userExists = await User.findOne({ email });                       // check if user exists in the database
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);                                 // generate salt
        const hashedPassword = await bcrypt.hash(password, salt);              // hash the password with the salt

        // 3. Create a new user document in mongoDB database
        const newUser = await User.create({
            username,
            email,
            passwordHash: hashedPassword,                                           // store the hashed password
        });

        // 4. Respond with the new user data and JWT token
        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            token: generateToken(newUser._id),                                  // generate JWT token
        });
    }   catch (error) {
        //5. Handle errors
        res.status(500).json({ message: 'Server error', error: error.message });
    }   
};

// -------------------------------------------LOGIN CONTROLLER---------------------------------------------------

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;                                  // destructure request body

        // 1. Check if user exists
        const user = await User.findOne({ email });                           // find user by email
        if (!user) {
            console.log('User not found'); // log for debugging
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 2. Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash); // compare hashed password with plain text password
        if (!isPasswordValid) {
            console.log('Invalid password'); // log for debugging
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 3. Respond with user data and JWT token
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),                                   // generate JWT token
        });
    } catch (error) {
        //4. Handle errors
        res.status(500).json({ message: 'Login Failed', error: error.message });
    }
};

// ------------------------------------------- Verify JWT Token ---------------------------------------------------

export const verifyToken = (req, res) => {
    res.json({
        success : true,
        user : req.user, // user data from the request
    });
}
