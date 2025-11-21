"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const http_1 = require("http");
const env_1 = require("./lib/env");
const routes_1 = __importDefault(require("./routes"));
const db_1 = __importDefault(require("./lib/db"));
const error_1 = require("./middleware/error");
const socket_1 = require("./lib/socket");
const app = (0, express_1.default)();
const PORT = env_1.ENV.PORT || 3000;
const ROOT = process.cwd();
// Core middleware
app.use(express_1.default.json({ limit: "5mb" }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.ENV.CLIENT_URL,
    credentials: true,
}));
// -------------------------------
// PRODUCTION STATIC SERVE
// -------------------------------
if (env_1.ENV.NODE_ENV === "production") {
    const clientDist = path_1.default.resolve(ROOT, "frontend/dist");
    app.use(express_1.default.static(clientDist));
    app.get("*", (req, res) => {
        if (req.path.startsWith("/api"))
            return;
        res.sendFile(path_1.default.join(clientDist, "index.html"));
    });
}
// API routes
app.use("/api", routes_1.default);
// Error handler
app.use(error_1.errorHandler);
// Create HTTP server + Socket.IO
const httpServer = (0, http_1.createServer)(app);
(0, socket_1.initSocketServer)(httpServer);
// Boot
(async () => {
    await (0, db_1.default)();
    httpServer.listen(PORT, () => {
        console.log(`HTTP + Socket.IO server running on port ${PORT}`);
    });
})();
