"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messages_controller_1 = require("../controllers/messages.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const asyncHandler_1 = require("../lib/asyncHandler");
const messageRouter = (0, express_1.Router)();
messageRouter.use(auth_middleware_1.default);
messageRouter.get('/contacts', (0, asyncHandler_1.asyncHandler)(messages_controller_1.getAllContacts));
messageRouter.get('/chats', (0, asyncHandler_1.asyncHandler)(messages_controller_1.getAllChatPartners));
messageRouter.get('/:id', (0, asyncHandler_1.asyncHandler)(messages_controller_1.getMessagesWithUser));
messageRouter.post('/send/:id', (0, asyncHandler_1.asyncHandler)(messages_controller_1.sendMessage));
messageRouter.get('/test', (req, res) => {
    console.log('message sent!');
    res.send('message sent');
});
exports.default = messageRouter;
