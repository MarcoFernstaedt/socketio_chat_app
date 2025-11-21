import { Router } from "express";
import { updateUserProfilePic } from "../controllers/users.controller.js";
import authorizationMiddleware from "../middleware/auth.middleware.js";
import { asyncHandler } from "../lib/asyncHandler.js";
const userRouter = Router();
userRouter.patch("/me", authorizationMiddleware, asyncHandler(updateUserProfilePic));
export default userRouter;
