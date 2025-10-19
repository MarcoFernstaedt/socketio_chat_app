import mongoose, { Document, Schema } from "mongoose";
import { Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId,
  email: string;
  fullname: string;
  password: string;
  profilePic?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    fullname: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    profilePic: { type: String, default: "" },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
