"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("./env");
const generateToken = (userId, res) => {
    const { JWT_SECRET } = env_1.ENV;
    if (!JWT_SECRET)
        throw new Error('JWT_SECRET is not defined in environment variables');
    const token = jsonwebtoken_1.default.sign({ userId }, JWT_SECRET, {
        expiresIn: "7d",
    });
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: env_1.ENV.NODE_ENV !== "development",
    });
    return token;
};
exports.generateToken = generateToken;
