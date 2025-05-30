import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
    addContact,
    getUserContact,
    updateProfile,
    removeProfileImage,
    searchUsers,
    getContactRequests,
    rejectContactRequest,
    blockContact
} from "../controllers/index.js";

const router = express.Router();

router.patch("/update-profile", protectRoute, updateProfile);

router.get("/contacts", protectRoute, getUserContact);

router.post("/add-contact", protectRoute, addContact);

router.post("/reject-request", protectRoute, rejectContactRequest);

router.post("/block", protectRoute, blockContact)

router.patch("/remove-profile-image", protectRoute, removeProfileImage);

router.get("/search-users", protectRoute, searchUsers);

router.get("/get-requested-contacts", protectRoute, getContactRequests);

export default router;
