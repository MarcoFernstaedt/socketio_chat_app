import { Router } from 'express';
import { getAllChatPartners, getAllContacts, getMessagesWithUser, sendMessage } from '../controllers/messages.controller.js';
import authorizationMiddleware from '../middleware/auth.middleware.js';
import { asyncHandler } from '../lib/asyncHandler.js';
const messageRouter = Router();
messageRouter.use(authorizationMiddleware);
messageRouter.get('/contacts', asyncHandler(getAllContacts));
messageRouter.get('/chats', asyncHandler(getAllChatPartners));
messageRouter.get('/:id', asyncHandler(getMessagesWithUser));
messageRouter.post('/send/:id', asyncHandler(sendMessage));
messageRouter.get('/test', (req, res) => {
    console.log('message sent!');
    res.send('message sent');
});
export default messageRouter;
