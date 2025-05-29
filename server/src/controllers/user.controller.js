import UserModel from "../models/user.model.js";
import { responseWriter, responseWriter500 } from "../lib/utils.js";
import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import { GetUserContacts, UpdateProfileService, RemoveProfileImageService } from "../services/user_service.js";
import { updateProfileSchema, addContactSchema } from "../lib/validation.js";

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

        // use service to update the user
        const updatedUser = await UpdateProfileService(userId, profileInfo);

        // check if the user was updated
        if (!updatedUser) {
            return responseWriter(res, 404, false, "User not found.");
        }
        return responseWriter(res, 200, true, "profile update successful", { user: updatedUser });
    } catch (err) {
        console.log(err);
        return responseWriter500(res, err);
    }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const removeProfileImage = async (req, res) => {
    try {
        const userId = req.user._id;

        const updatedUser = await RemoveProfileImageService(userId);
        if (!updatedUser) { return responseWriter(res, 404, false, "User not found."); }

        return responseWriter(res, 200, true, "profile photo removed successfully", { user: updatedUser, });
    } catch (err) {
        console.error(err);
        return responseWriter500(res, err);
    }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getUserContact = async (req, res) => {
    try {
        const userId = req.user._id;
        let contacts = await GetUserContacts(userId);
        return responseWriter(res, 200, true, "Contacts retrived successfully", { contacts });
    } catch (err) {
        console.err(err);
        return responseWriter500(res, err);
    }
};



/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const addContact = async (req, res) => {
    try {
        const userId = req.user._id;
        const { error } = addContactSchema.validate(req.body);
        if (error) {
            return responseWriter(res, 400, false, error.details[0].message);
        }
        const { friendId } = req.body;

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
        console.error(err);
        return responseWriter500(res, err);
    }
};



/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
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
