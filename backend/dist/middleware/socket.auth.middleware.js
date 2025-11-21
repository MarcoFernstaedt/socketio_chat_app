"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const env_1 = require("../lib/env");
const user_1 = require("../lib/serializers/user");
const AppError_1 = require("../lib/AppError");
const getJwtFromCookieHeader = (cookieHeader) => {
    if (!cookieHeader)
        return null;
    const jwtPair = cookieHeader
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith("jwt="));
    if (!jwtPair)
        return null;
    const [, token] = jwtPair.split("=");
    return token || null;
};
const socketAuthMiddleware = async (socket, next) => {
    try {
        const token = getJwtFromCookieHeader(socket.handshake.headers.cookie);
        if (!token) {
            console.log("Socket connection rejected: No token provided");
            return next(new AppError_1.AppError("Unauthorized - No token provided", 401));
        }
        if (!env_1.ENV.JWT_SECRET) {
            console.error("JWT_SECRET is not set in ENV");
            return next(new AppError_1.AppError("Server configuration error", 500));
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_1.ENV.JWT_SECRET);
        if (!decoded ||
            typeof decoded !== "object" ||
            typeof decoded.userId !== "string") {
            console.log("Socket connection rejected: Invalid token payload");
            return next(new AppError_1.AppError("Unauthorized - Invalid token", 401));
        }
        const { userId } = decoded;
        const user = await User_1.default.findById(userId)
            .select("_id fullname email profilePic")
            .lean();
        if (!user) {
            console.log("Socket connection rejected: User not found");
            return next(new AppError_1.AppError("Unauthorized - User not found", 401));
        }
        socket.data.userId = user._id.toString();
        socket.data.user = (0, user_1.toSafeUser)(user);
        return next();
    }
    catch (err) {
        console.error("Socket auth error:", err);
        return next(new AppError_1.AppError("Unauthorized", 401));
    }
};
exports.socketAuthMiddleware = socketAuthMiddleware;
