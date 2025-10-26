import type { IUser } from "../../models/User";

export type SafeUser = {
  _id: string;
  fullname: string;
  email: string;
  profilePic?: string;
};

export const toSafeUser = (
  u: Pick<IUser, "_id" | "fullname" | "email" | "profilePic">
): SafeUser => {
  return {
    _id: u._id.toString(),
    fullname: u.fullname,
    email: u.email,
    profilePic: u.profilePic,
  };
};
