import mongoose from "mongoose";
import { responseWriter, responseWriter500 } from "../lib/utils.js";
import MessageModel from "../models/message.model.js";
import Joi from "joi";
import cloudinary from "../lib/cloudinary.js";

const sendMessageSchema = Joi.object({
    text: Joi.string(),
    image: Joi.string(),
});

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getConverstion = async (req, res) => {
    try {
        const { id: otherId } = req.params;
        const selfId = req.user._id;
        if (!mongoose.isValidObjectId(otherId)) {
            return responseWriter(res, 401, false, "Invalid contact");
        }
        const messages = await MessageModel.find({
            $or: [
                { senderId: selfId, receiverId: otherId },
                { senderId: otherId, receiverId: selfId },
            ],
        });
        return responseWriter(res, 200, true, "message retrived successful", { messages });
    } catch (err) {
        console.error(err);
        return responseWriter500(res, err);
    }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const sendMessage = async (req, res) => {
    try {
        const { error } = sendMessageSchema.validate(req.body);
        if (error) {
            return responseWriter(res, 400, false, error.details[0].message);
        }
        const selfId = req.user._id;
        const { id: otherId } = req.params;
        if (!mongoose.isValidObjectId(otherId)) {
            return responseWriter(res, 401, false, "invalid contact");
        }
        if (selfId == otherId) {
            return responseWriter(res, 401, false, "can't send message to self");
        }
        const { text, image } = req.body;
        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new MessageModel({
            senderId: selfId,
            receiverId: otherId,
            text,
            image: imageUrl,
        });
        await newMessage.save();

        return responseWriter(res, 201, true, "message sent", { message: newMessage });
    } catch (err) {
        return responseWriter500(res, err);
    }
};
