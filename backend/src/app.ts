import express from "express";
import type { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { createServer } from "http";
import 'dotenv/config';
console.log("BOOT: env loaded, PORT=", process.env.PORT);
import { ENV } from "./lib/env.js";
console.log("BOOT: ENV ok");
import router from "./routes/index.js";
import connectDB from "./lib/db.js";
import { errorHandler } from "./middleware/error.js";
import { initSocketServer } from "./lib/socket.js";

const app = express();
app.set("trust proxy", 1);

const PORT = Number(process.env.PORT) || 8080;
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

// Health check for Sevalla probes
app.get("/health", (_req: Request, res: Response) => {
  return res.status(200).send("ok");
});

// API routes
app.use("/api", router);

// -------------------------------
// PRODUCTION STATIC SERVE
// -------------------------------
if (ENV.NODE_ENV === "production") {
  const clientDist = path.resolve(ROOT, "../frontend/dist");

  app.use(express.static(clientDist));

  app.get("*", (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith("/api")) return next();
    return res.sendFile(path.join(clientDist, "index.html"));
  });
}

// Error handler
app.use(errorHandler);

// Create HTTP server + Socket.IO
const httpServer = createServer(app);
initSocketServer(httpServer);

// Boot
(async () => {
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`HTTP + Socket.IO server running on port ${PORT}`);
  });
  await connectDB();
})();