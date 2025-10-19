import { Router, Request, Response } from 'express';
import path from 'path';
import authRouter from './auth.route';
import messageRouter from './messages.route';

const router = Router();
const ROOT = process.cwd(); 

router.use('/auth', authRouter);
router.use('/messages', messageRouter);

// keep LAST: SPA fallback
router.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.resolve(ROOT, 'frontend/dist/index.html'));
});

export default router;