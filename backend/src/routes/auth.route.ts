import { Router } from "express";
import {
  signup,
  login,
  logout,
  isAuthorizedUser,
} from "../controllers/auth.controller";
import { authorizationMiddleware } from "../middleware/auth.middleware";
import arcjetProtection from "../middleware/arcjet.middleware";

const authRouter = Router();

authRouter.use(arcjetProtection);

authRouter.post("/sign-in", login);

authRouter.post("/sign-up", signup);

authRouter.post("/logout", logout);

authRouter.get("/me", authorizationMiddleware, isAuthorizedUser);

export default authRouter;
