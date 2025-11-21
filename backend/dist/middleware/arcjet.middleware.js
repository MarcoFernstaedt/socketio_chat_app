import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";
const arcjetProtection = async (req, res, next) => {
    try {
        const decision = await aj.protect(req);
        // If Arcjet denies the request, STOP execution
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ message: "Too many requests - Please try again later." });
            }
            if (decision.reason.isBot()) {
                return res.status(403).json({ message: "Bot access denied" });
            }
            return res.status(403).json({ message: "Access denied by security policy." });
        }
        // Spoofed bot detection also needs a return
        if (decision.results.some(isSpoofedBot)) {
            return res.status(403).json({
                message: "Malicious bot activity detected."
            });
        }
        // If all good, continue the chain
        return next();
    }
    catch (err) {
        console.error("Arcjet error:", err);
        // Fail open but DO NOT hang
        return next();
    }
};
export default arcjetProtection;
