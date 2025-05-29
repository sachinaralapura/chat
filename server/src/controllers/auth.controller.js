import UserModel from "../models/user.model.js";
import bcryt from "bcrypt";
import { responseWriter, responseWriter500, SetJwtToCookie } from "../lib/utils.js";
import { signupSchema, loginSchema } from "../lib/validation.js";
// -------------------------------------------------------------
/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const signup = async (req, res) => {
    try {
        // Validate request body
        const { error } = signupSchema.validate(req.body);
        if (error) {
            console.error(error.details[0].message);
            return responseWriter(res, 400, false, error.details[0].message);
        }
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return responseWriter(res, 409, false, "User already exists");
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

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const login = async (req, res) => {
    try {
        // Validate request body
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return responseWriter(res, 400, false, error.details[0].message);
        }
        const { email, password } = req.body;
        // Find user
        const user = await UserModel.findOne({ email });
        if (!user) {
            return responseWriter(res, 401, false, "User not found");
        }

        // Verify password
        const validPassword = await bcryt.compare(password, user.password);
        if (!validPassword) {
            return responseWriter(res, 401, false, "Invalid password");
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

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const logout = (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 });
        return responseWriter(res, 200, true, "logout successful");
    } catch (err) {
        console.error(err);
        return responseWriter500(res, err);
    }
};

// -------------------------------------------------------------
/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
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
