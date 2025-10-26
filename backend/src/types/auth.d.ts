import type { JwtPayload } from "jsonwebtoken";

export type TokenPayload = JwtPayload & { userId: string };
export type AuthContext = Readonly<{ userId: string }>;

declare module "express-serve-static-core" {
  interface Request {
    auth?: AuthContext;
  }
}

export {};