import { Router, Request, Response } from 'express';
import authRouter from './auth.route.js';
import messageRouter from './messages.route.js';
import userRouter from './user.route.js';
import arcjetProtection from '../middleware/arcjet.middleware.js';

const router = Router();

router.use(arcjetProtection);

// Fast test route – IMPORTANT: use valid HTTP status 200
router.get('/ping', (_req: Request, res: Response) => {
  return res.status(200).json({ message: 'pinged' });
});

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/messages', messageRouter);

export default router;