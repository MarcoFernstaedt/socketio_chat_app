// src/middleware/socket.auth.middleware.ts
import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { ENV } from "../lib/env";
import { TokenPayload } from "../types/auth";
import { toSafeUser, SafeUser } from "../lib/serializers/user";
import { AppError } from "../lib/AppError";

type NextFn = (err?: Error) => void;

export interface AuthedSocket extends Socket {
  data: {
    userId?: string;
    user?: SafeUser;
    [key: string]: unknown;
  };
}

const getJwtFromCookieHeader = (cookieHeader?: string): string | null => {
  if (!cookieHeader) return null;

  const jwtPair = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("jwt="));

  if (!jwtPair) return null;

  const [, token] = jwtPair.split("=");
  return token || null;
};

export const socketAuthMiddleware = async (
  socket: AuthedSocket,
  next: NextFn
) => {
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

    const decoded = jwt.verify(token, ENV.JWT_SECRET) as TokenPayload;

    if (
      !decoded ||
      typeof decoded !== "object" ||
      typeof (decoded as any).userId !== "string"
    ) {
      console.log("Socket connection rejected: Invalid token payload");
      return next(new AppError("Unauthorized - Invalid token", 401));
    }

    const { userId } = decoded as TokenPayload;

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
  } catch (err) {
    console.error("Socket auth error:", err);
    return next(new AppError("Unauthorized", 401));
  }
};