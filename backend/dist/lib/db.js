"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const connectDB = async () => {
    try {
        const { MONGO_URI } = env_1.ENV;
        if (!MONGO_URI)
            throw new Error('MONGO_URI is not set');
        const conn = await mongoose_1.default.connect(MONGO_URI);
        console.log(`MongoDB connected successfully: ${conn.connection.host}`);
    }
    catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
};
exports.default = connectDB;
