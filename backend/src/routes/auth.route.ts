import { Router, Request, Response } from 'express';
import { signup } from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post("/sign-in", signup);

authRouter.post('/sign-up', signup);

authRouter.get("/logout", (req: Request, res: Response): void => {
  console.log("sign in");
  res.send("logout route hit"); // always send a response
});

export default authRouter;