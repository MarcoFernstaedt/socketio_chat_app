"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getAllChatPartners = exports.getMessagesWithUser = exports.getAllContacts = void 0;
const mongoose_1 = require("mongoose");
const User_1 = __importDefault(require("../models/User"));
const message_1 = __importDefault(require("../models/message"));
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const AppError_1 = require("../lib/AppError");
const socket_1 = require("../lib/socket");
/**
 * GET /message/contacts
 * Return all users except the authenticated user
 */
const getAllContacts = async (req, res) => {
    if (!req.auth)
        throw new AppError_1.AppError("Unauthorized", 401);
    const contacts = await User_1.default.find({ _id: { $ne: req.auth.userId } })
        .select("fullname email profilePic")
        .lean();
    return res.status(200).json(contacts);
};
exports.getAllContacts = getAllContacts;
/**
 * GET /message/:id
 * Return all messages between me and :id
 */
const getMessagesWithUser = async (req, res) => {
    if (!req.auth)
        throw new AppError_1.AppError("Unauthorized", 401);
    const { id: recipientId } = req.params;
    if (!recipientId || !(0, mongoose_1.isValidObjectId)(recipientId)) {
        throw new AppError_1.AppError("Invalid user id", 400);
    }
    const myId = new mongoose_1.Types.ObjectId(req.auth.userId);
    const otherId = new mongoose_1.Types.ObjectId(recipientId);
    const messages = await message_1.default.find({
        $or: [
            { senderId: myId, receiverId: otherId },
            { senderId: otherId, receiverId: myId },
        ],
    })
        .sort({ createdAt: 1 })
        .lean();
    return res.status(200).json(messages);
};
exports.getMessagesWithUser = getMessagesWithUser;
/**
 * GET /message/chats
 * Return unique chat partners for the authenticated user
 */
const getAllChatPartners = async (req, res) => {
    if (!req.auth)
        throw new AppError_1.AppError("Unauthorized", 401);
    const myId = new mongoose_1.Types.ObjectId(req.auth.userId);
    const messages = await message_1.default.find({
        $or: [{ senderId: myId }, { receiverId: myId }],
    }).select("senderId receiverId");
    const myIdStr = myId.toString();
    const partnerIds = new Set();
    for (const m of messages) {
        const s = m.senderId.toString();
        const r = m.receiverId.toString();
        if (s !== myIdStr)
            partnerIds.add(s);
        if (r !== myIdStr)
            partnerIds.add(r);
    }
    if (partnerIds.size === 0) {
        return res.status(200).json([]);
    }
    const partners = await User_1.default.find({ _id: { $in: [...partnerIds] } })
        .select("fullname email profilePic")
        .lean();
    return res.status(200).json(partners);
};
exports.getAllChatPartners = getAllChatPartners;
/**
 * POST /message/send/:id
 * Body: { text?: string; image?: string }
 * :id is the receiver's user id
 */
const sendMessage = async (req, res) => {
    if (!req.auth)
        throw new AppError_1.AppError("Unauthorized", 401);
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    if (!receiverId || !(0, mongoose_1.isValidObjectId)(receiverId)) {
        throw new AppError_1.AppError("Invalid receiverId", 400);
    }
    if (!text && !image) {
        throw new AppError_1.AppError("Message or image is required", 400);
    }
    if (req.auth.userId === receiverId) {
        throw new AppError_1.AppError("Cannot send messages to yourself", 400);
    }
    let imageUrl;
    if (image) {
        const upload = await cloudinary_1.default.uploader.upload(image);
        imageUrl = upload.secure_url;
    }
    const senderId = new mongoose_1.Types.ObjectId(req.auth.userId);
    const receiverObjectId = new mongoose_1.Types.ObjectId(receiverId);
    const newMessage = await message_1.default.create({
        senderId,
        receiverId: receiverObjectId,
        text,
        image: imageUrl,
    });
    // Realtime push via Socket.IO if receiver is online
    const receiverSocketId = (0, socket_1.getReceiverSocketId)(receiverId);
    if (receiverSocketId && socket_1.ioInstance) {
        socket_1.ioInstance.to(receiverSocketId).emit("newMessage", newMessage);
    }
    return res.status(201).json(newMessage);
};
exports.sendMessage = sendMessage;
