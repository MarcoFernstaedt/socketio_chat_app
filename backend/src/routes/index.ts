import { Router, Request, Response } from 'express';
import path from 'path';
import authRouter from './auth.route.js';
import messageRouter from './messages.route.js';
import userRouter from './user.route.js';
// import arcjetProtection from '../middleware/arcjet.middleware.js';

const router = Router();

// router.use(arcjetProtection);
router.get('/ping', (req: Request, res: Response) => {
  console.log('ping')
})

router.use('/auth', authRouter);
router.use('/users', userRouter)
router.use('/messages', messageRouter);

export default router;