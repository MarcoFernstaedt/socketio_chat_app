"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const asyncHandler_1 = require("../lib/asyncHandler");
const userRouter = (0, express_1.Router)();
userRouter.patch("/me", auth_middleware_1.default, (0, asyncHandler_1.asyncHandler)(users_controller_1.updateUserProfilePic));
exports.default = userRouter;
