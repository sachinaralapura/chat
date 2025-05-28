import express from "express";
import UserModel from "../models/user.model.js";

const router = express.Router();

router.post("/deleteuser", async (req, res) => {
    try {
        const { email } = req.body;
        await UserModel.deleteOne({ email: email });
        return res.status(200).json({
            status: true,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false });
    }
});

export default router;
