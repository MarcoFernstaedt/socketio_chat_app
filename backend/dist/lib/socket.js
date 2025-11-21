import { Server } from "socket.io";
import { ENV } from "../lib/env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";
const userSocketMap = new Map();
export const getReceiverSocketId = (userId) => {
    return userSocketMap.get(userId);
};
export let ioInstance = null;
export const initSocketServer = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: ENV.CLIENT_URL,
            credentials: true,
        },
    });
    ioInstance = io;
    io.use(socketAuthMiddleware);
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
