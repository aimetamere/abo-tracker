import User from '../models/user.model.js';
import ErrorResponse from '../utils/ErrorResponse.js';

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password');

        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: {
                users,
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            const error = new ErrorResponse('Invalid user ID format', 400);
            throw error;
        }

        const user = await User.findById(id).select('-password');

        if (!user) {
            const error = new ErrorResponse('User not found', 404);
            throw error;
        }

        res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            data: {
                user,
            }
        });
    } catch (error) {
        next(error);
    }
};

