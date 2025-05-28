import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token)
            return res.status(401).json({
                status: false,
                message: "Unauthorized - No token provided",
            });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded)
            return res.status(401).json({
                status: false,
                message: "Unauthorized - Invalid token",
            });

        const user = await UserModel.findById(decoded.user_id).select("username email");
        if (!user)
            return res.status(404).json({
                status: false,
                message: "User not found",
            });

        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: false,
            message: "Internal server error",
        });
    }
};
