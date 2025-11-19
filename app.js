import express from 'express';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { PORT_NUMBER } from './config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import workflowRouter from './routes/workflow.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';
import connectToDatabase, { mongoose } from './database/mongodb.js';

const app = express();

// CORS middleware - must be before routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json()); // allow app to handle json data sent in requests or api call
app.use(express.urlencoded({ extended: false })); // allow app to handle url encoded data sent in requests or api call
app.use(cookieParser()); // allow app to handle cookies sent in requests or api call

// Apply Arcjet protection middleware BEFORE routes
app.use(arcjetMiddleware);

// API routes MUST come before static files to avoid conflicts
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

// Serve static files from public directory (after API routes)
app.use(express.static(join(__dirname, 'public')));

app.use(errorMiddleware);

// Serve homepage.html for root route and aliases
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'homepage.html'));
});

// Alias routes for homepage
app.get('/homepage', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'homepage.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'homepage.html'));
});

// Connect to database first, then start the server
const startServer = async () => {
    try {
        // Connect to database and wait for connection before starting server
        await connectToDatabase();
        
        // Verify connection is ready
        if (mongoose.connection.readyState !== 1) {
            throw new Error('Database connection not established');
        }
        
        // Start server only after database is connected
        // Listen on 0.0.0.0 to accept connections from all network interfaces (required for VPS deployment)
        app.listen(PORT_NUMBER, '0.0.0.0', () => {
            console.log(`Server running on http://0.0.0.0:${PORT_NUMBER}`);
            console.log(`Server accessible at http://72.62.38.240:${PORT_NUMBER}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        console.error('Please check your MongoDB connection string and network connectivity.');
        process.exit(1);
    }
};

startServer();

export default app;
