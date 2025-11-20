import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Subscription from '../models/subscription.model.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../../config/env.js';
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
            // Check if user has any subscriptions
            const subscriptions = await Subscription.find({ user: existingUser._id });
            
            // If user has subscriptions, they should sign in instead
            if(subscriptions && subscriptions.length > 0) {
                const error = new ErrorResponse('User already exists. Please sign in instead.', 409);
                throw error;
            }
            
            // If user exists but has no subscriptions, allow them to "sign up" again
            // Update their account info and sign them in
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            existingUser.name = name;
            existingUser.password = hashedPassword;
            await existingUser.save({ session });

            const token = jwt.sign({ id: existingUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

            await session.commitTransaction();
            session.endSession();

            res.status(200).json({
                success: true,
                message: 'Account reactivated successfully. Please fill out the form to create a subscription.',
                data: {
                    user: existingUser,
                    token,
                }
            });
            return;
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
            const error = new ErrorResponse('Invalid credentials', 401);
            throw error;
        }

        // Check if user has any subscriptions (expired or active)
        const subscriptions = await Subscription.find({ user: user._id });
        
        if(!subscriptions || subscriptions.length === 0) {
            const error = new ErrorResponse('No subscription found. Please sign up to create an account.', 403);
            throw error;
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
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