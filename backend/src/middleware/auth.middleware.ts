import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../lib/env.js";
import { TokenPayload, AuthContext } from "../types/auth.js";

const authorizationMiddleware: RequestHandler = (req, res, next) => {
  try {
    const token = req.cookies?.jwt;
    if (!token) return res.status(401).json({ message: "Unauthorized - No token" });

    const decoded = jwt.verify(token, ENV.JWT_SECRET as string) as TokenPayload;
    if (!decoded?.userId) return res.status(401).json({ message: "Unauthorized - Bad token" });

    const auth: AuthContext = Object.freeze({ userId: decoded.userId });
    req.auth = auth;
    return next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authorizationMiddleware;