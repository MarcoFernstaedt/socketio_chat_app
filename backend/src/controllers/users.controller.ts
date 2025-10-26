// src/controllers/user.controller.ts
import { RequestHandler } from "express";
import cloudinary from "../lib/cloudinary";
import User from "../models/User";
import { toSafeUser } from "../lib/serializers/user";
import { AppError } from "../lib/AppError";

type UpdateBody = { profilePic: string };

export const updateUserProfilePic: RequestHandler = async (req, res) => {
  if (!req.auth) throw new AppError("Unauthorized", 401);

  const { profilePic } = req.body as UpdateBody;
  if (!profilePic) throw new AppError("Profile pic is required.", 400);

  const upload = await cloudinary.uploader.upload(profilePic);

  const updatedUser = await User.findByIdAndUpdate(
    req.auth.userId,
    { profilePic: upload.secure_url },
    { new: true, select: "fullname email profilePic" }
  );

  if (!updatedUser) throw new AppError("User not found", 404);

  return res.status(200).json(toSafeUser(updatedUser));
};
