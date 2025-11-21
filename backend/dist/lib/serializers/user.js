"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSafeUser = void 0;
const toSafeUser = (u) => {
    return {
        _id: u._id.toString(),
        fullname: u.fullname,
        email: u.email,
        profilePic: u.profilePic,
    };
};
exports.toSafeUser = toSafeUser;
