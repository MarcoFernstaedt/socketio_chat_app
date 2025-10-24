import { Request, Response, NextFunction } from "express";
import aj from "../lib/arcjet";
import { isSpoofedBot } from "@arcjet/inspect";

const arcjetProtection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res
          .status(429)
          .json({ message: "Too many request - Please try again later." });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ message: "Bot access denied" });
      } else {
        res.status(403).json({ message: "Access denied by security polocy." });
      }
    }

    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        message: "Malicious bot activity detected.",
      });
    }

    next();
  } catch (err) {
    console.error("Arcjet error: ", err);
    next();
  }
};

export default arcjetProtection;