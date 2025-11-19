import User from '../models/user.model.js';

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            data: users,
        })
    } catch (error) {
        next(error);
    }
}

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');


        if(!user) {
            const error = new ErrorResponse('User not found', 404);
            throw error;
        }

        res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            data: user,
        })
    } catch (error) {
        next(error);
    }
}