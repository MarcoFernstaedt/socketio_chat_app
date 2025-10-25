import { Router, Request, Response } from 'express'
import { getAllChatPartners, getAllContacts, getMessagesWithUser, sendMessage } from '../controllers/messages.controller';
import authorizationMiddleware from '../middleware/auth.middleware';
import arcjetProtection from '../middleware/arcjet.middleware';

const messageRouter = Router();

messageRouter.use(arcjetProtection);
messageRouter.use(authorizationMiddleware)

messageRouter.get('/contacts', getAllContacts);
messageRouter.get('/chats', getAllChatPartners);
messageRouter.get('/:id', getMessagesWithUser);
messageRouter.post('/send/:id', sendMessage);


messageRouter.get('/test', (req: Request, res: Response): void => {
    console.log('message sent!')
    res.send('message sent')
})

export default messageRouter