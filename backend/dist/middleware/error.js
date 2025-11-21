"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("../lib/AppError");
const errorHandler = (err, _req, res, _next) => {
    const status = err instanceof AppError_1.AppError ? err.statusCode : 500;
    const message = err instanceof AppError_1.AppError && err.isOperational
        ? err.message
        : "Internal server error";
    // TODO: structured logging here
    return res.status(status).json({ message });
};
exports.errorHandler = errorHandler;
