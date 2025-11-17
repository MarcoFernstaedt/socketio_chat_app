// src/app.ts
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { createServer } from "http";

import { ENV } from "./lib/env";
import router from "./routes";
import connectDB from "./lib/db";
import { errorHandler } from "./middleware/error";
import { initSocketServer } from "./lib/socket";

const app = express();
const PORT = ENV.PORT || 3000;
const ROOT = process.cwd(); // project root

// Core middleware
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);

// Static (prod)
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.resolve(ROOT, "frontend/dist")));
}

// API routes
app.use("/api", router);

// Error handler (after routes)
app.use(errorHandler);

// Create HTTP server and attach Socket.IO
const httpServer = createServer(app);
initSocketServer(httpServer); // sets up io, middleware, connection handlers

// Boot
(async () => {
  await connectDB();
  httpServer.listen(PORT, () => {
    console.log(`HTTP + Socket.IO server running on port ${PORT}`);
  });
})();