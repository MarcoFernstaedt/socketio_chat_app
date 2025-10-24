import { Router } from "express";
import { updateUserProfilePic } from "../controllers/users.controller";
import { authorizationMiddleware } from "../middleware/auth.middleware";

const userRouter = Router();

userRouter.patch("/me", authorizationMiddleware, updateUserProfilePic);

export default userRouter;
