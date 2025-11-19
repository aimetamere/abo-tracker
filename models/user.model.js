import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User Name is required'],
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, 'User Email is required'],
        unique: true,
        trim: true,
        minlength: 8,
        maxlength: 255,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'User Password is required'],
        minlength: 6,
}
}, { timestamps: true }); // so we know when the user was created and updated

const User = mongoose.model('User', userSchema);

export default User;


// { name: 'John Doe', email: 'john.doe@example.com', password: '123456' } how it shows in the database