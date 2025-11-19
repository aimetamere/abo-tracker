import ErrorResponse from '../utils/ErrorResponse.js';

const errorMiddleware = (err, req, res, next) => {
    try {
        let error = { ...err };

        error.message = err.message;

        console.log(error);

        //mongoose bad ObjectId
        if (err.name === 'CastError') {
            const message = 'Resource not found';

            error = new ErrorResponse(message);
            error.statusCode = 404;
        }

        //mongoose duplicate key
        if (err.code === 11000) {
            const message = 'Duplicate field value entered';

            error = new ErrorResponse(message);
            error.statusCode = 400;
        }

        //mongoose validation error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map((val) => val.message);

            error = new ErrorResponse(message.join(', '));
            error.statusCode = 400;
        }

        //mongoose connection timeout
        if (err.message && err.message.includes('buffering timed out')) {
            const message = 'Database connection timeout. Please check your MongoDB connection.';
            error = new ErrorResponse(message);
            error.statusCode = 503;
        }

        //mongoose connection errors
        if (err.name === 'MongoServerSelectionError' || err.name === 'MongoNetworkError') {
            const message = 'Database connection error. Please check your MongoDB server.';
            error = new ErrorResponse(message);
            error.statusCode = 503;
        }

        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || 'Server Error',
        });
            
    } catch (error) {
        next(error);
    }
};

// how it works 
// create a subscription -> middleware (check for renewal date) -> (we can have an other middleware) middleware (check for errors) -> next -> controller 

export default errorMiddleware;

// objectives:
// 1. handle errors in the application
// 2. handle errors in the database
// 3. handle errors in the API
// 4. handle errors in the frontend
// 5. handle errors in the backend

