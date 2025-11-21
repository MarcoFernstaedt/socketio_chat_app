export class AppError extends Error {
    statusCode;
    isOperational = true; // marks “expected” errors (validation, auth, etc.)
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
    }
}
