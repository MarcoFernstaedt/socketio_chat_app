import { RequestHandler } from "express";
import User from "../models/User";
import { ReqWithUser } from "../types/request";
import { Types } from "mongoose";
import Message from "../models/message";
import cloudinary from "../lib/cloudinary";

export const getAllContacts: RequestHandler = async (req, res) => {
  try {
    const user = (req as ReqWithUser).user;
    const userId = new Types.ObjectId(user._id.toString());

    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    return res.status(200).json(filteredUsers);
  } catch (err) {
    console.error("Error in getAllContacts:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getMessagesWithUser: RequestHandler = async (req, res) => {
  try {
    const userId = (req as ReqWithUser).user._id.toString();
    const { id: recipiantId } = req.params;

    const messages = Message.find({
      $or: [
        { senderId: userId, receiverId: recipiantId },
        { senderId: recipiantId, receiverId: userId },
      ],
    });

    return res.status(200).json(messages);
  } catch (err) {
    console.error("Error in getMessagesWithUser:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getAllChatPartners: RequestHandler = async (req, res) => {
  try {
    const userId = (req as ReqWithUser).user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find all messages involving the logged-in user
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === userId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];

    if (chatPartnerIds.length === 0) {
      return res.status(200).json([]);
    }

    const chatPartners = await User.find({
      _id: { $in: chatPartnerIds },
    }).select("-password");

    return res.status(200).json(chatPartners);
  } catch (err) {
    console.error("Error in getAllChats:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const sendMessage: RequestHandler = async (req, res) => {
  try {
    const { message, image, receiverId } = req.body;
    const senderId = (req as ReqWithUser).user?._id;

    if (!senderId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!message && !image) {
      return res.status(400).json({ message: "Message or image is required." });
    }

    if (senderId.equals(receiverId))
      return res
        .status(400)
        .json({ message: "Cannot send messages to yourself." });

    let imageUrl: string | undefined;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text: message,
      image: imageUrl,
    });

    return res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error in sendMessage:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};
