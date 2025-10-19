import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils";

type SignupRequestBody = {
  fullname: string;
  password: string;
  email: string;
};

export const signup = async (
  req: Request<{}, {}, SignupRequestBody>,
  res: Response
): Promise<Response> => {
  try {
    const { fullname, password, email } = req.body;

    // Validate required fields
    if (!fullname || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Password length validation
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists login" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await new User({
      fullname,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    generateToken(savedUser._id.toString(), res);


    // Respond with new user info (excluding password)
    return res.status(201).json({
      _id: newUser._id,
      fullname: newUser.fullname,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (err) {
    console.error("Error in signup controller:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};