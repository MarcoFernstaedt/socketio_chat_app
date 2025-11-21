"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfilePic = void 0;
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const User_1 = __importDefault(require("../models/User"));
const user_1 = require("../lib/serializers/user");
const AppError_1 = require("../lib/AppError");
const updateUserProfilePic = async (req, res) => {
    if (!req.auth)
        throw new AppError_1.AppError("Unauthorized", 401);
    const { profilePic } = req.body;
    if (!profilePic)
        throw new AppError_1.AppError("Profile pic is required.", 400);
    const upload = await cloudinary_1.default.uploader.upload(profilePic);
    const updatedUser = await User_1.default.findByIdAndUpdate(req.auth.userId, { profilePic: upload.secure_url }, { new: true, select: "fullname email profilePic" });
    if (!updatedUser)
        throw new AppError_1.AppError("User not found", 404);
    return res.status(200).json((0, user_1.toSafeUser)(updatedUser));
};
exports.updateUserProfilePic = updateUserProfilePic;
