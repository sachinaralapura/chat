import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
    addContact,
    getUserContact,
    updateProfile,
    removeProfileImage,
    searchUsers,
} from "../controllers/user.controller.js";

const router = express.Router();

router.patch("/update-profile", protectRoute, updateProfile);

router.get("/contacts", protectRoute, getUserContact);

router.post("/add-contact", protectRoute, addContact);

router.patch("/remove-profile-image", protectRoute, removeProfileImage);

router.get("/search-users", protectRoute, searchUsers);

export default router;
