import { Router, Request, Response } from 'express'
import { getAllChatPartners, getAllContacts, getMessagesWithUser, sendMessage } from '../controllers/messages.controller';
import authorizationMiddleware from '../middleware/auth.middleware';
import { asyncHandler } from '../lib/asyncHandler';

const messageRouter = Router();

messageRouter.use(authorizationMiddleware)

messageRouter.get('/contacts', asyncHandler(getAllContacts));
messageRouter.get('/chats', asyncHandler(getAllChatPartners));
messageRouter.get('/:id', asyncHandler(getMessagesWithUser));
messageRouter.post('/send/:id', asyncHandler(sendMessage));


messageRouter.get('/test', (req: Request, res: Response): void => {
    console.log('message sent!')
    res.send('message sent')
})

export default messageRouter