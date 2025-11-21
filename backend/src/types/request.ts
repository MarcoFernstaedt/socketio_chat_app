import { Request } from "express";
import { IUser } from "../models/User.js";

export type ReqWithUser<B = any> = Request<{}, any, B> & { user: IUser };