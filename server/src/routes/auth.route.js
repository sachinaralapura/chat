import express from "express";
import { check, login, logout, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/logout", protectRoute, logout);

router.get("/check", protectRoute, check);

export default router;
