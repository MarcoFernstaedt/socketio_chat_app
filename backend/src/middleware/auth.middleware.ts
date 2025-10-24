import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { ENV } from "../lib/env";

type TokenPayload = JwtPayload & { userId: string };
type ReqWithUser = Request & { user?: IUser }

export const authorizationMiddleware = async (
  req: ReqWithUser,
  res: Response,
  next: NextFunction
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

    req.user = user;
    return next();
  } catch (err) {
    console.error("Authorization middleware: ", err)
    return res.status(401).json({ message: "Internal server error" });
  }
};
