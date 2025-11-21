import { Response } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = (userId: string, res: Response): string => {
  const { JWT_SECRET } = ENV;
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined in environment variables');
  
  const token = jwt.sign({ userId }, JWT_SECRET as string, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: ENV.NODE_ENV !== "development",
  });

  return token;
};
