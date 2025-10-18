import { Router, Request, Response } from 'express'

const messageRouter = Router();

messageRouter.get('/send', (req: Request, res: Response): void => {
    console.log('message sent')
    res.send('Message send'))
}