import mongoose from 'mongoose';
import { DB_URI, NODE_ENV } from '../config/env.js';

const connectToDatabase = async () => {
    if (!DB_URI) {
        console.warn('DB_URI not defined. Database operations will fail.');
        return;
    }
    
    try {
        // Add connection options with timeout to prevent hanging
        await mongoose.connect(DB_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
            socketTimeoutMS: 45000,
        });
        console.log(`Connected to database in ${NODE_ENV} mode`);
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        console.warn('Server will start but database operations will fail.');
        // Don't exit - allow server to start for testing
    }
}

export default connectToDatabase;
