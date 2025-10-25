import { RequestHandler, Response } from "express";
import cloudinary from "../lib/cloudinary";
import User, { IUser } from "../models/User";
import { ReqWithUser } from "../types/request";

type UpdateBody = { profilePic: string };

export const updateUserProfilePic: RequestHandler = async (
  req,
  res
): Promise<Response> => {
  try {
    const { profilePic } = (req as ReqWithUser<UpdateBody>).body;
    const user = (req as ReqWithUser).user;
    if (!profilePic)
      return res.status(400).json({ message: "Profile pic is required." });
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const upload = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      user._id.toString(),
      { profilePic: upload.secure_url },
      { new: true, select: "-password" }
    );

    return res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Update profile pic error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};
