import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6, // Consider using bcrypt for hashing passwords
        },
        phone: {
            type: String,
        },
        profilePicture: {
            type: String, // URL to the user's profile picture
        },
        contacts: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                blocked: { type: Boolean, default: false },
                name: { type: String, default: undefined },
            },
        ],
        requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" },],
        bio: {
            type: String,
            maxlength: 200,
        },
        onlineStatus: {
            type: Boolean,
            default: false,
        },
        lastSeen: {
            type: Date,
        },
    },

    { timestamps: true },
);
userSchema.index({ email: 1 }); // 1 for ascending order
const UserModel = mongoose.model("User", userSchema);
export default UserModel;
