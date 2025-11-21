import { Router } from 'express';
import path from 'path';
import authRouter from './auth.route.js';
import messageRouter from './messages.route.js';
import userRouter from './user.route.js';
import arcjetProtection from '../middleware/arcjet.middleware.js';
const router = Router();
const ROOT = process.cwd();
router.use(arcjetProtection);
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/messages', messageRouter);
// keep LAST: SPA fallback
router.get('*', (_req, res) => {
    res.sendFile(path.resolve(ROOT, 'frontend/dist/index.html'));
});
export default router;
