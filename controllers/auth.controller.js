import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';
import ErrorResponse from '../utils/ErrorResponse.js';

export const signUp = async (req, res, next) => {
    //implement sign up logic
    //session of mongoose transaction for atomicity ((update))
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        //logic to create a new user
        const  { name, email, password } = req.body;

        //check if user already exists ((API call))
        const existingUser = await User.findOne({ email });

        if(existingUser) {
            const error = new ErrorResponse('user already exists', 409);
            throw error;
        }
         // Hash the password = means securing it because don't want to store it in the database in plain text
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create([{ name, email, password: hashedPassword }], { session });

        const token = jwt.sign({ id: newUser[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                user: newUser[0],
                token,
            }
        });
    } catch (error) { // if anything goes wrong, we abort the transaction and end the session
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        //check if user exists
        const user = await User.findOne({ email });

        if(!user) {
            const error = new ErrorResponse('Invalid credentials', 401);
            throw error;
        }

        //check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            const error = new Error('Invalid credentials', 401);
            throw error;
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(200).json({
            success: true,
            messag: 'User signed in successfully',
            data: {
                user: user,
                token,
            }
        });
    } catch (error) {
        next(error);
    }
}

export const signOut = async (req, res, next) => {}



//atomic operations is either all or nothing
// what is a req body -> is an object containing data from the client that is sent to the server
// post request allow to pass some data 