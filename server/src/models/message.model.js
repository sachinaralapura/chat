import mongoose from "mongoose";
const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
        },
        image: {
            type: String,
        },
    },
    { timestamps: true },
);

// Index 1: For the first part of your $or query
messageSchema.index({ senderId: 1, receiverId: 1 });

// Index 2: For the second part of your $or query
messageSchema.index({ receiverId: 1, senderId: 1 });

// index 3 on timestamp
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: 1 });
messageSchema.index({ receiverId: 1, senderId: 1, createdAt: 1 });

const MessageModel = mongoose.model("Message", messageSchema);
export default MessageModel;
