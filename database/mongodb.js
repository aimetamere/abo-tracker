import mongoose from 'mongoose';
import { DB_URI, NODE_ENV } from '../config/env.js';

const connectToDatabase = async () => {
    if (!DB_URI) {
        console.error('DB_URI not defined. Cannot connect to database.');
        throw new Error('DB_URI environment variable is not set');
    }
    
    try {
        // Check if already connected
        if (mongoose.connection.readyState === 1) {
            console.log('Already connected to database');
            return;
        }
        
        // Add connection options with timeout to prevent hanging
        await mongoose.connect(DB_URI, {
            serverSelectionTimeoutMS: 10000, // Increased to 10 seconds
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
        });
        
        // Verify connection
        if (mongoose.connection.readyState === 1) {
            console.log(`Connected to database in ${NODE_ENV} mode`);
        } else {
            throw new Error('Connection established but readyState is not 1');
        }
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        console.warn('Server will start but database operations will fail.');
        // Don't exit - allow server to start for testing
    }
}

// Export mongoose connection for checking connection state
export { mongoose };
export default connectToDatabase;
