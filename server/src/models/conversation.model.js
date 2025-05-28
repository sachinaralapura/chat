import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                // Array of user IDs participating in the conversation (always 2 for one-on-one)
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", // Reference to the User schema
                required: true,
            },
        ],
        lastMessage: {
            // Reference to the last message sent in this conversation
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: null,
        },
    },
    { timestamps: true },
);

const conversationModel = mongoose.model("Conversion", conversationSchema);
export default conversationModel;
