import { Router, Request, Response } from 'express';
import { signup, login, logout } from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post("/sign-in", login);

authRouter.post('/sign-up', signup);

authRouter.post("/logout", logout);

export default authRouter;