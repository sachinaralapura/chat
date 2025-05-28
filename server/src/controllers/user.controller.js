import Joi from "joi";
import UserModel from "../models/user.model.js";
import { responseWriter, responseWriter500 } from "../lib/utils.js";
import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";

const updateProfileSchema = Joi.object({
    phone: Joi.string()
        .pattern(/^[0-9]*$/)
        .allow("")
        .custom((value, helpers) => {
            if (value === "") {
                return value; // Valid if empty string (length 0)
            }
            if (value.length >= 10 && value.length <= 12) {
                return value; // Valid if length is between 10 and 12
            }
            return helpers.error("string.length"); // Custom error for invalid length
        }, "Phone number length validation"),

    profilePicture: Joi.string(),
    bio: Joi.string().min(0).max(200),
    username: Joi.string().min(3),
});

const addContactSchema = Joi.object({
    friendId: Joi.string().required(),
});

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const updateProfile = async (req, res) => {
    try {
        const { error } = updateProfileSchema.validate(req.body);
        if (error) {
            return responseWriter(res, 400, false, error.details[0].message);
        }
        const userId = req.user._id;
        let profileInfo = req.body;

        if (profileInfo.profilePicture) {
            const uploadResponse = await cloudinary.uploader.upload(profileInfo.profilePicture);
            profileInfo.profilePicture = uploadResponse.secure_url;
        }
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $set: profileInfo }, // Use $set to update only the provided fields
            { new: true, runValidators: true, context: "query" },
        ).select("-password -contacts"); // Exclude password from the returned document
        if (!updatedUser) {
            return responseWriter(res, 404, false, "User not found.");
        }
        return responseWriter(res, 200, true, "profile update successful", { user: updatedUser });
    } catch (err) {
        return responseWriter500(res, err);
    }
};

export const removeProfileImage = async (req, res) => {
    try {
        const userId = req.user._id;
        const update = {
            $unset: {
                profilePicture: 1, //
            },
        };
        const options = { new: true };

        const updatedUser = await UserModel.findByIdAndUpdate(userId, update, options);
        if (!updatedUser) {
            return responseWriter(res, 404, false, "User not found.");
        }
        return responseWriter(res, 200, true, "profile photo removed successfully", {
            user: updatedUser,
        });
    } catch (err) {
        console.error(err);
        return responseWriter500(res, err);
    }
};

export const getUserContact = async (req, res) => {
    try {
        const userId = req.user._id;
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
        console.log(contacts);
        return responseWriter(res, 200, true, "Contacts retrived successfully", { contacts });
    } catch (err) {
        console.err(err);
        return responseWriter500(res, err);
    }
};

export const addContact = async (req, res) => {
    try {
        const userId = req.user._id;
        const { error } = addContactSchema.validate(req.body);
        if (error) {
            return responseWriter(res, 400, false, error.details[0].message);
        }
        const { friendId } = req.body;
        console.log(userId);

        if (!mongoose.Types.ObjectId.isValid(friendId)) {
            return responseWriter(res, 400, false, "Invalid friend ID format.");
        }

        if (userId == friendId) {
            return responseWriter(res, 400, false, "you are always your friend!");
        }

        // 1. Find the user who is adding the contact
        const user = await UserModel.findById(userId);
        if (!user) {
            return responseWriter(res, 404, false, "User not found.");
        }

        // 2. Verify that the friend actually exists in the database
        const friend = await UserModel.findById(friendId).select("_id username");
        if (!friend) {
            return responseWriter(res, 404, false, "Contact user does not exist.");
        }

        // 3. Check if the contact already exists in the user's contacts list
        const contactAlreadyExists = user.contacts.some(
            (contact) => contact.userId.toString() === friendId,
        );

        if (contactAlreadyExists) {
            return responseWriter(res, 409, false, "Contact already exists in the list.");
        }

        // 4. Push the new contact object into the contacts array
        user.contacts.push({
            userId: friendId,
            blocked: false, // Default to not blocked when adding
            name: friend.username || undefined, // Add nickname if provided, otherwise undefined
        });

        // 5. Save the updated user document
        await user.save();
        return responseWriter(res, 200, true, "Contact added successfully", {
            contacts: user.contacts,
        });
    } catch (err) {
        console.log(err);
        return responseWriter500(res, err);
    }
};

export const searchUsers = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return responseWriter(res, 400, false, "email query paramater required");
        }
        const users = await UserModel.find({ email: { $regex: email, $options: "i" } })
            .select("-password -contacts")
            .limit(6);

        if (users.length === 0) {
            return responseWriter(res, 404, false, "no users found");
        }

        return responseWriter(res, 200, true, "", { users });
    } catch (err) {
        console.error(err);
        return responseWriter500(res, err);
    }
};
