"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocketServer = exports.ioInstance = exports.getReceiverSocketId = void 0;
// src/socket/index.ts
const socket_io_1 = require("socket.io");
const env_1 = require("../lib/env");
const socket_auth_middleware_1 = require("../middleware/socket.auth.middleware");
const userSocketMap = new Map();
const getReceiverSocketId = (userId) => {
    return userSocketMap.get(userId);
};
exports.getReceiverSocketId = getReceiverSocketId;
exports.ioInstance = null;
const initSocketServer = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: env_1.ENV.CLIENT_URL,
            credentials: true,
        },
    });
    exports.ioInstance = io;
    io.use(socket_auth_middleware_1.socketAuthMiddleware);
    io.on("connection", (socket) => {
        const userId = socket.data.userId;
        if (!userId) {
            console.log("Socket connection has no userId, disconnecting");
            socket.disconnect(true);
            return;
        }
        userSocketMap.set(userId, socket.id);
        console.log("User connected:", socket.data.user?.fullname, userId);
        io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
        socket.on("disconnect", () => {
            userSocketMap.delete(userId);
            io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
            console.log("User disconnected:", socket.data.user?.fullname, userId);
        });
    });
    return io;
};
exports.initSocketServer = initSocketServer;
