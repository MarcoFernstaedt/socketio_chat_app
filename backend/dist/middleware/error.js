import { AppError } from "../lib/AppError.js";
export const errorHandler = (err, _req, res, _next) => {
    const status = err instanceof AppError ? err.statusCode : 500;
    const message = err instanceof AppError && err.isOperational
        ? err.message
        : "Internal server error";
    // TODO: structured logging here
    return res.status(status).json({ message });
};
