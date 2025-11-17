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

authRouter.post("/sign-in", asyncHandler(login));
authRouter.post("/sign-up", asyncHandler(signup));
authRouter.post("/logout", asyncHandler(logout));
authRouter.get("/me", authorizationMiddleware, asyncHandler(isAuthorizedUser));

export default authRouter;
