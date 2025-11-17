// src/socket/index.ts
import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";
import { ENV } from "../lib/env";
import { socketAuthMiddleware, AuthedSocket } from "../middleware/socket.auth.middleware";

const userSocketMap = new Map<string, string>();

export const initSocketServer = (httpServer: HTTPServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: ENV.CLIENT_URL,
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket: AuthedSocket) => {
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