"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorizedUser = exports.logout = exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const utils_1 = require("../lib/utils");
const emailHandlers_1 = require("../emails/emailHandlers");
const env_1 = require("../lib/env");
const AppError_1 = require("../lib/AppError");
const user_1 = require("../lib/serializers/user");
/**
 * @desc Register a new user
 * @route POST /auth/sign-up
 */
const signup = async (req, res) => {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password)
        throw new AppError_1.AppError("All fields are required.", 400);
    if (password.length < 6)
        throw new AppError_1.AppError("Password must be at least 6 characters.", 400);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
        throw new AppError_1.AppError("Invalid email format.", 400);
    const existingUser = await User_1.default.findOne({ email });
    if (existingUser)
        throw new AppError_1.AppError("User already exists. Please log in.", 409);
    const hashedPassword = await bcryptjs_1.default.hash(password, await bcryptjs_1.default.genSalt(10));
    const newUser = await User_1.default.create({ fullname, email, password: hashedPassword });
    (0, utils_1.generateToken)(newUser._id.toString(), res);
    // send welcome email asynchronously
    void (0, emailHandlers_1.sendWelcomeEmail)(newUser.email, newUser.fullname, env_1.ENV.CLIENT_URL).catch((err) => console.error("Failed to send welcome email:", err));
    return res.status(201).json((0, user_1.toSafeUser)(newUser));
};
exports.signup = signup;
/**
 * @desc Log in user
 * @route POST /auth/sign-in
 */
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        throw new AppError_1.AppError("Email and password are required.", 400);
    const user = await User_1.default.findOne({ email });
    if (!user)
        throw new AppError_1.AppError("Invalid email or password.", 400);
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid)
        throw new AppError_1.AppError("Invalid email or password.", 400);
    (0, utils_1.generateToken)(user._id.toString(), res);
    return res.status(200).json((0, user_1.toSafeUser)(user));
};
exports.login = login;
/**
 * @desc Log out user (clear JWT cookie)
 * @route POST /auth/logout
 */
const logout = (_req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        sameSite: "strict",
        secure: env_1.ENV.NODE_ENV !== "development",
        expires: new Date(0),
    });
    return res.status(200).json({ message: "Logged out successfully." });
};
exports.logout = logout;
/**
 * @desc Return authorized user info
 * @route GET /auth/me
 * @access Private
 */
const isAuthorizedUser = async (req, res) => {
    if (!req.auth)
        throw new AppError_1.AppError("Unauthorized", 401);
    const user = await User_1.default.findById(req.auth.userId).select("-password");
    if (!user)
        throw new AppError_1.AppError("User not found.", 404);
    return res.status(200).json((0, user_1.toSafeUser)(user));
};
exports.isAuthorizedUser = isAuthorizedUser;
