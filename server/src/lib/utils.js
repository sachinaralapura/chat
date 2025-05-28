import jwt from "jsonwebtoken";
/**
 * @param {string} id - User Id
 * @param {string} username - Username
 * @param {string} email - user email
 * @param {import('express').Response} res - The Express response object
 */
export const SetJwtToCookie = (id, email, res) => {
    // Generate JWT token
    const token = jwt.sign({ user_id: id, email: email }, process.env.JWT_SECRET, {
        expiresIn: "2d",
    });
    // Set httpOnly Cookie
    res.cookie("token", token, {
        maxAge: 2 * 24 * 60 * 60 * 1000, // two days
        httpOnly: true, // prevent XSS attacks cross-site scription attacks
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development",
    });
};

/**
 *
 * @param {import("express").Response} res
 * @param {number} code
 * @param {boolean} status
 * @param {string} message
 */
export function responseWriter(res, code, status, message, extraFields = {}) {
    return res.status(code).json({
        status,
        message,
        ...extraFields,
    });
}
/**
 *
 * @param {import("express").Response} res
 * @param {any} error
 */
export function responseWriter500(res, error = null) {
    return responseWriter(res, 500, false, "Internal server error", {
        error,
    });
}
