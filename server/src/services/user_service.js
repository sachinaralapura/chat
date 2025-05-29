import UserModel from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

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

/**
 * 
 * @param {string} userId 
 * @returns 
 */
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
/**
 * 
 * @param {string} userId 
 * @param {{profilePicture: string }} profileInfo 
 */
export async function UpdateProfileService(userId, profileInfo) {
    try {
        // check if there is  profile picture and upload to cloudinary 
        if (profileInfo.profilePicture) {
            const uploadResponse = await cloudinary.uploader.upload(profileInfo.profilePicture);
            profileInfo.profilePicture = uploadResponse.secure_url;
        }
        // update the user
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $set: profileInfo }, // Use $set to update only the provided fields
            { new: true, runValidators: true, context: "query" },
        ).select("-password -contacts"); // Exclude password from the returned document
        return updatedUser
    } catch (err) {
        throw err
    }
}

export async function RemoveProfileImageService(userId) {
    try {
        const update = {
            $unset: {
                profilePicture: 1, //
            },
        };
        const options = { new: true };
        const updatedUser = await UserModel.findByIdAndUpdate(userId, update, options);
        return updatedUser;
    } catch (err) {
        throw err
    }
}