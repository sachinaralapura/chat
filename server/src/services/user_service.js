import UserModel from "../models/user.model.js";

/**
 *
 * @param {string} userId
 * @param {boolean} onlineStatus
 */
export async function UpdateOnlineStatus(userId, onlineStatus) {
    try {
        await UserModel.findByIdAndUpdate(userId, { onlineStatus });
    } catch (err) {
        console.error("error UpdateOnlineStatus", err);
    }
}

export async function GetUserContacts(userId) {
    try {
        const user = await UserModel.findById(userId)
            .populate({
                path: "contacts.userId",
                select: "-password -contacts",
            })
            .exec();

        if (!user) return responseWriter(res, 404, false, "user not found");

        let contacts = [];
        user.contacts.map((contact) => {
            contacts.push({
                _id: contact.userId._id,
                email: contact.userId.email,
                phone: contact.userId.phone,
                username: contact.userId.username,
                nickName: contact.name || contact.userId.username,
                blocked: contact.blocked,
                profilePicture: contact.userId.profilePicture,
                bio: contact.userId.bio,
                onlineStatus: contact.userId.onlineStatus,
                lastSeen: contact.userId.lastSeen || contact.userId.createdAt,
            });
        });
        return contacts;
    } catch (err) {
        throw err;
    }
}

export async function GetUserContactsId(userId) {
    try {
        const user = await UserModel.findById(userId);
        if (!user) return responseWriter(res, 404, false, "user not found");

        let contacts = [];
        user.contacts.map((contact) => {
            contacts.push(contact.userId.toString());
        });
        return contacts;
    } catch (err) {
        throw err;
    }
}
