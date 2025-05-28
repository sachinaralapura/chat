import Joi from "joi";
import UserModel from "../models/user.model.js";
import bcryt from "bcrypt";
import { responseWriter, responseWriter500, SetJwtToCookie } from "../lib/utils.js";

// Validation schema for signup
const signupSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

// Validation schema for login
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

// -------------------------------------------------------------
export const signup = async (req, res) => {
    try {
        // Validate request body
        const { error } = signupSchema.validate(req.body);
        if (error) {
            console.error(error.details[0].message);
            return res.status(400).json({
                status: false,
                message: error.details[0].message,
            });
        }
        const { username, email, password } = req.body;
        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                status: false,
                message: "User already exists",
            });
        }
        // Hash password
        const salt = await bcryt.genSalt(10);
        const hashPassword = await bcryt.hash(password, salt);
        // create a new user
        const newUser = await UserModel.create({
            username,
            email,
            password: hashPassword,
        });
        if (newUser) {
            // set jwt token to cookie
            SetJwtToCookie(newUser._id, newUser.email, res);
            await newUser.save();
            return responseWriter(res, 201, true, "User registered successfully", {
                user: {
                    _id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    profilePicture: newUser.profilePicture,
                },
            });
        }
        return responseWriter(res, 400, falses, "User registration failed");
    } catch (error) {
        console.error(error);
        return responseWriter500(res, error);
    }
};

// -------------------------------------------------------------
export const login = async (req, res) => {
    try {
        // Validate request body
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: false,
                message: error.details[0].message,
            });
        }
        const { email, password } = req.body;
        // Find user
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                status: false,
                message: "User not found",
            });
        }
        // Verify password
        const validPassword = await bcryt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                status: false,
                message: "Invalid password",
            });
        }
        // Generate JWT token
        SetJwtToCookie(user._id, user.email, res);
        return responseWriter(res, 200, true, "login successful", {
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                profilePicture: user.profilePicture,
                bio: user.bio,
                onlineStatus: user.onlineStatus,
                lastSeen: user.lastSeen,
            },
        });
    } catch (error) {
        console.error(error);
        return responseWriter500(res, error);
    }
};

// -------------------------------------------------------------
export const logout = (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 });
        return res.status(200).json({
            status: true,
            message: "logout successful",
        });
    } catch (err) {
        console.error(err);
        return responseWriter500(res, err);
    }
};

// -------------------------------------------------------------
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */
export const check = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id).select("-password");
        if (!user) {
            return responseWriter(res, 400, false, "user not found");
        }
        return responseWriter(res, 200, true, "valid user", { user });
    } catch (err) {
        console.error(err);
        return responseWriter500(res, err);
    }
};
