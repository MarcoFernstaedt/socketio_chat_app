import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils";
import { sendWelcomeEmail } from "../emails/emailHandlers";
import { ENV } from "../lib/env";

type SignupRequestBody = { fullname: string; password: string; email: string };
type LoginRequestBody = { email: string; password: string };

export const signup = async (
  req: Request<{}, {}, SignupRequestBody>,
  res: Response
): Promise<Response> => {
  try {
    const { fullname, password, email } = req.body;

    if (!fullname || !password || !email)
      return res.status(400).json({ message: "All fields are required" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid email format" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(409)
        .json({ message: "User already exists. Please log in." });

    const hashedPassword = await bcrypt.hash(
      password,
      await bcrypt.genSalt(10)
    );
    const newUser = new User({ fullname, email, password: hashedPassword });
    const savedUser = await newUser.save();

    generateToken(savedUser._id.toString(), res);

    void sendWelcomeEmail(
      savedUser.email,
      savedUser.fullname,
      ENV.CLIENT_URL as string
    ).catch((err) => console.error("Failed to send welcome emails.", err));

    return res.status(201).json({
      _id: savedUser._id,
      fullname: savedUser.fullname,
      email: savedUser.email,
      profilePic: savedUser.profilePic,
    });
  } catch (err) {
    console.error("Error in signup controller:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response
): Promise<Response> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid user credentials" });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid user credentials" });

    generateToken(user._id.toString(), res);

    return res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.error("Error in login controller: ", err);
    res.status(500).json({ message: 'Internal server error'})
  }

  return res.status(200).json({ message: "Login successful" });
};

export const logout = (_req: Request, res: Response) => {
  res.cookie('jwt', '', {
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV !== 'development',
  expires: new Date(0),
  maxAge: 0,
});
  return res.status(200).json({ message: "Logged out successfully"})
}