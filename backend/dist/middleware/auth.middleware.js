"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../lib/env");
const authorizationMiddleware = (req, res, next) => {
    try {
        const token = req.cookies?.jwt;
        if (!token)
            return res.status(401).json({ message: "Unauthorized - No token" });
        const decoded = jsonwebtoken_1.default.verify(token, env_1.ENV.JWT_SECRET);
        if (!decoded?.userId)
            return res.status(401).json({ message: "Unauthorized - Bad token" });
        const auth = Object.freeze({ userId: decoded.userId });
        req.auth = auth;
        return next();
    }
    catch {
        return res.status(401).json({ message: "Unauthorized" });
    }
};
exports.default = authorizationMiddleware;
