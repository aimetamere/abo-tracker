// Custom Error class for API errors
class ErrorResponse extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}

export default ErrorResponse;

