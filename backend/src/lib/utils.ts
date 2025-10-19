import { Response } from "express";
import jwt from "jsonwebtoken";

export const generateToken = (userId: string, res: Response): string => {
  const { JWT_SECRET } = process.env;
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined in environment variables');
  
  const token = jwt.sign({ userId }, JWT_SECRET as string, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
