import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";
import { toSafeUser } from "../lib/serializers/user.js";
import { AppError } from "../lib/AppError.js";
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
export const socketAuthMiddleware = async (socket, next) => {
    try {
        const token = getJwtFromCookieHeader(socket.handshake.headers.cookie);
        if (!token) {
            console.log("Socket connection rejected: No token provided");
            return next(new AppError("Unauthorized - No token provided", 401));
        }
        if (!ENV.JWT_SECRET) {
            console.error("JWT_SECRET is not set in ENV");
            return next(new AppError("Server configuration error", 500));
        }
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if (!decoded ||
            typeof decoded !== "object" ||
            typeof decoded.userId !== "string") {
            console.log("Socket connection rejected: Invalid token payload");
            return next(new AppError("Unauthorized - Invalid token", 401));
        }
        const { userId } = decoded;
        const user = await User.findById(userId)
            .select("_id fullname email profilePic")
            .lean();
        if (!user) {
            console.log("Socket connection rejected: User not found");
            return next(new AppError("Unauthorized - User not found", 401));
        }
        socket.data.userId = user._id.toString();
        socket.data.user = toSafeUser(user);
        return next();
    }
    catch (err) {
        console.error("Socket auth error:", err);
        return next(new AppError("Unauthorized", 401));
    }
};
