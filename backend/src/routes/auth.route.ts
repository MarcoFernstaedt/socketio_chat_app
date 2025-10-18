import { Router, Request, Response } from 'express';

const authRouter = Router();

authRouter.get("/sign-in", (req: Request, res: Response): void => {
  console.log("sign in");
  res.send("Sign-in route hit"); // always send a response
});

authRouter.get("/sign-up", (req: Request, res: Response): void => {
  console.log("sign in");
  res.send("Sign-up route hit"); // always send a response
});

authRouter.get("/logout", (req: Request, res: Response): void => {
  console.log("sign in");
  res.send("logout route hit"); // always send a response
});

export default authRouter;