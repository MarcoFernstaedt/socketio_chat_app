import path from 'path';
import { Router, Request, Response } from "express";
import authRouter from "./auth.route";
import messageRouter from "./messages.route";
const __dirname = path.resolve();
const router = Router();

router.use('/auth', authRouter)
router.use('/messages', messageRouter)

router.get('*', (req: Request, res: Response): void => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
})

export default router;