import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import { NEWMESSAGE } from "../lib/constants.js";
import { io, getAllSocketsOfUser } from "../lib/socketio.js";
import { responseWriter, responseWriter500 } from "../lib/utils.js";
import MessageModel from "../models/message.model.js";
import { sendMessageSchema } from "../lib/validation.js";

/**
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

        // send the newMessage through socket for real time experience
        const sockets = getAllSocketsOfUser(otherId);
        if (sockets.length !== 0) {
            for (const socket of sockets) {
                io.to(socket).emit(NEWMESSAGE, newMessage);
            }
        }

        return responseWriter(res, 201, true, "message sent", { message: newMessage });
    } catch (err) {
        console.error(err);
        return responseWriter500(res, err);
    }
};
