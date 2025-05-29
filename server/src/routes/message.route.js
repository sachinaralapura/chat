import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getConverstion, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/get-conversation/:id", protectRoute, getConverstion);

router.post("/send/:id", protectRoute, sendMessage);

export default router;
