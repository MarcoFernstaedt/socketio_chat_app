import { Router } from "express";
import {
  signup,
  login,
  logout,
  isAuthorizedUser,
} from "../controllers/auth.controller";
import authorizationMiddleware from "../middleware/auth.middleware";
import arcjet from "@arcjet/node";
import { asyncHandler } from "../lib/asyncHandler";

const authRouter = Router();

// authRouter.use(arcjet);

authRouter.post("/sign-in", login);
authRouter.post("/sign-up", signup);
authRouter.post("/logout", logout);
authRouter.get("/me", authorizationMiddleware, asyncHandler(isAuthorizedUser));

export default authRouter;
