import { Router } from "express";
import { updateUserProfilePic } from "../controllers/users.controller";
import authorizationMiddleware from "../middleware/auth.middleware";
import { asyncHandler } from "../lib/asyncHandler";
import arcjetProtection from "../middleware/arcjet.middleware";

const userRouter = Router();

userRouter.patch("/me", authorizationMiddleware, asyncHandler(updateUserProfilePic));

export default userRouter;
