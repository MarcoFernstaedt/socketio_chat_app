import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { ENV } from "../lib/env.js";
import { AppError } from "../lib/AppError.js";
import { toSafeUser } from "../lib/serializers/user.js";

/**
 * @desc Register a new user
 * @route POST /auth/sign-up
 */
export const signup: RequestHandler = async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password)
    throw new AppError("All fields are required.", 400);
  if (password.length < 6)
    throw new AppError("Password must be at least 6 characters.", 400);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) throw new AppError("Invalid email format.", 400);

  const existingUser = await User.findOne({ email });
  if (existingUser)
    throw new AppError("User already exists. Please log in.", 409);

  const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
  const newUser = await User.create({ fullname, email, password: hashedPassword });

  generateToken(newUser._id.toString(), res);

  // send welcome email asynchronously
  void sendWelcomeEmail(
    newUser.email,
    newUser.fullname,
    ENV.CLIENT_URL as string
  ).catch((err) => console.error("Failed to send welcome email:", err));

  return res.status(201).json(toSafeUser(newUser));
};

/**
 * @desc Log in user
 * @route POST /auth/sign-in
 */
export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new AppError("Email and password are required.", 400);

  const user = await User.findOne({ email });
  if (!user) throw new AppError("Invalid email or password.", 400);

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new AppError("Invalid email or password.", 400);

  generateToken(user._id.toString(), res);
  return res.status(200).json(toSafeUser(user));
};

/**
 * @desc Log out user (clear JWT cookie)
 * @route POST /auth/logout
 */
export const logout: RequestHandler = (_req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    sameSite: "strict",
    secure: ENV.NODE_ENV !== "development",
    expires: new Date(0),
  });
  return res.status(200).json({ message: "Logged out successfully." });
};

/**
 * @desc Return authorized user info
 * @route GET /auth/me
 * @access Private
 */
export const isAuthorizedUser: RequestHandler = async (req, res) => {
  if (!req.auth) throw new AppError("Unauthorized", 401);

  const user = await User.findById(req.auth.userId).select("-password");
  if (!user) throw new AppError("User not found.", 404);

  return res.status(200).json(toSafeUser(user));
};
