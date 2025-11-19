import express from 'express';
import cookieParser from 'cookie-parser';

import { PORT } from './config/env.js';

import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import workflowRouter from './routes/workflow.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';
import connectToDatabase from './database/mongodb.js';

const app = express();

app.use(express.json()); // allow app to handle json data sent in requests or api call
app.use(express.urlencoded({ extended: false })); // allow app to handle url encoded data sent in requests or api call
app.use(cookieParser()); // allow app to handle cookies sent in requests or api call

// Apply Arcjet protection middleware BEFORE routes
app.use(arcjetMiddleware);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send('Hell');
});

// Connect to database first, then start the server
const startServer = async () => {
    try {
        // Connect to database (non-blocking - server will start even if DB fails)
        connectToDatabase().catch(err => {
            // Error already logged in connectToDatabase
        });
        
        // Start server immediately
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`); // string interpolation and update depending on the environment
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

export default app;

// https://www.youtube.com/watch?v=rOpEN1JDaD0&t=1s 1:57:11