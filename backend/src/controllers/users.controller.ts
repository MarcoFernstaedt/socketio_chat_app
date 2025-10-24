import { Request, Response } from "express";
import cloudinary from "../lib/cloudinary";
import User, { IUser } from "../models/User";

type UpdateBody = { profilePic: string };
type ReqWithUser<B = unknown> = Request<{}, any, B> & { user?: IUser };

export const updateUserProfilePic = async (
  req: ReqWithUser<UpdateBody>,
  res: Response
): Promise<Response> => {
  try {
    const { profilePic } = req.body; // typed!
    if (!profilePic)
      return res.status(400).json({ message: "Profile pic is required." });
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const upload = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id.toString(),
      { profilePic: upload.secure_url },
      { new: true, select: "-password" }
    );

    return res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Update profile pic error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};
