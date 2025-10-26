import { RequestHandler } from "express";
import { Types, isValidObjectId } from "mongoose";
import User from "../models/User";
import Message from "../models/message";
import cloudinary from "../lib/cloudinary";
import { AppError } from "../lib/AppError";

/**
 * GET /message/contacts
 * Return all users except the authenticated user
 */
export const getAllContacts: RequestHandler = async (req, res) => {
  if (!req.auth) throw new AppError("Unauthorized", 401);

  const contacts = await User.find({ _id: { $ne: req.auth.userId } })
    .select("fullname email profilePic")
    .lean();

  return res.status(200).json(contacts);
};

/**
 * GET /message/:id
 * Return all messages between me and :id
 */
export const getMessagesWithUser: RequestHandler = async (req, res) => {
  if (!req.auth) throw new AppError("Unauthorized", 401);

  const { id: recipientId } = req.params;
  if (!isValidObjectId(recipientId)) throw new AppError("Invalid user id", 400);

  const myId = new Types.ObjectId(req.auth.userId);
  const otherId = new Types.ObjectId(recipientId);

  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: otherId },
      { senderId: otherId, receiverId: myId },
    ],
  })
    .sort({ createdAt: 1 })
    .lean();

  return res.status(200).json(messages);
};

/**
 * GET /message/chats
 * Return unique chat partners for the authenticated user
 */
export const getAllChatPartners: RequestHandler = async (req, res) => {
  if (!req.auth) throw new AppError("Unauthorized", 401);

  const myId = new Types.ObjectId(req.auth.userId);

  const messages = await Message.find({
    $or: [{ senderId: myId }, { receiverId: myId }],
  }).select("senderId receiverId");

  const partnerIds = new Set<string>();
  for (const m of messages) {
    const s = m.senderId.toString();
    const r = m.receiverId.toString();
    if (s !== myId.toString()) partnerIds.add(s);
    if (r !== myId.toString()) partnerIds.add(r);
  }
  if (partnerIds.size === 0) return res.status(200).json([]);

  const partners = await User.find({ _id: { $in: [...partnerIds] } })
    .select("fullname email profilePic")
    .lean();

  return res.status(200).json(partners);
};

/**
 * POST /message/send/:id
 * Body: { message?: string; image?: string; receiverId: string }
 */
export const sendMessage: RequestHandler = async (req, res) => {
  if (!req.auth) throw new AppError("Unauthorized", 401);

  const { message, image, receiverId } = req.body as {
    message?: string;
    image?: string;
    receiverId: string;
  };

  if (!receiverId || !isValidObjectId(receiverId))
    throw new AppError("Invalid receiverId", 400);

  if (!message && !image)
    throw new AppError("Message or image is required", 400);

  if (req.auth.userId === receiverId)
    throw new AppError("Cannot send messages to yourself", 400);

  let imageUrl: string | undefined;
  if (image) {
    const upload = await cloudinary.uploader.upload(image);
    imageUrl = upload.secure_url;
  }

  const newMessage = await Message.create({
    senderId: new Types.ObjectId(req.auth.userId),
    receiverId: new Types.ObjectId(receiverId),
    text: message,
    image: imageUrl,
  });

  return res.status(201).json(newMessage);
};
