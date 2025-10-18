import { Router, Request, Response } from "express";
import authRouter from "./auth.route";
import messageRouter from "./messages.route";

const router = Router();

router.use('/auth', authRouter)
router.use('/messages', messageRouter)

export default router;