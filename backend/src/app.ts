// src/app.ts
import express from "express";
import type { Request, Response } from 'express';
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { createServer } from "http";

import { ENV } from "./lib/env.js";
import router from "./routes/index.js";
import connectDB from "./lib/db.js";
import { errorHandler } from "./middleware/error.js";
import { initSocketServer } from "./lib/socket.js";

const app = express();
const PORT = ENV.PORT || 3000;
const ROOT = process.cwd();

// Core middleware
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);

// -------------------------------
// PRODUCTION STATIC SERVE
// -------------------------------
if (ENV.NODE_ENV === "production") {
  const clientDist = path.resolve(ROOT, "frontend/dist");

  app.use(express.static(clientDist));

  app.get("*", (req: Request, res: Response) => {
    if (req.path.startsWith("/api")) return;
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

// API routes
app.use("/api", router);

// Error handler
app.use(errorHandler);

// Create HTTP server + Socket.IO
const httpServer = createServer(app);
initSocketServer(httpServer);

// Boot
(async () => {
  await connectDB();
  httpServer.listen(PORT, () => {
    console.log(`HTTP + Socket.IO server running on port ${PORT}`);
  });
})();