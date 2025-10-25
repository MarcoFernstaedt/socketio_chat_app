import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User";
import { ENV } from "../lib/env";
import { ReqWithUser } from "../types/request";

type TokenPayload = JwtPayload & { userId: string };

const authorizationMiddleware: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const token = req.cookies?.jwt;
    if (!token)
      return res.status(401).json({ message: "Unauthorized - No token" });

    const decoded = jwt.verify(token, ENV.JWT_SECRET as string) as TokenPayload;
    if (!decoded?.userId)
      return res.status(401).json({ message: "Unauthorized - Bad token" });

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    (req as ReqWithUser).user = user; // cast here
    return next();
  } catch (err) {
    console.error("Authorization middleware:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authorizationMiddleware;
