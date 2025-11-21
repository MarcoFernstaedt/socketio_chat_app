export const toSafeUser = (u) => {
    return {
        _id: u._id.toString(),
        fullname: u.fullname,
        email: u.email,
        profilePic: u.profilePic,
    };
};
