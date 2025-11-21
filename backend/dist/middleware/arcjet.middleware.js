"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const arcjet_1 = __importDefault(require("../lib/arcjet"));
const inspect_1 = require("@arcjet/inspect");
const arcjetProtection = async (req, res, next) => {
    try {
        const decision = await arcjet_1.default.protect(req);
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                res
                    .status(429)
                    .json({ message: "Too many request - Please try again later." });
            }
            else if (decision.reason.isBot()) {
                res.status(403).json({ message: "Bot access denied" });
            }
            else {
                res.status(403).json({ message: "Access denied by security polocy." });
            }
        }
        if (decision.results.some(inspect_1.isSpoofedBot)) {
            return res.status(403).json({
                message: "Malicious bot activity detected.",
            });
        }
        next();
    }
    catch (err) {
        console.error("Arcjet error: ", err);
        next();
    }
};
exports.default = arcjetProtection;
