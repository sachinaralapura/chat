import Joi from "joi";
// Validation schema for signup
export const signupSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

// Validation schema for login
export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

// Validation schema for update profile
export const updateProfileSchema = Joi.object({
    phone: Joi.string().pattern(/^[0-9]*$/).allow("").custom((value, helpers) => {
        if (value === "") {
            return value; // Valid if empty string (length 0)
        }
        if (value.length >= 10 && value.length <= 12) {
            return value; // Valid if length is between 10 and 12
        }
        return helpers.error("string.length"); // Custom error for invalid length
    }, "Phone number length validation"),

    profilePicture: Joi.string(),
    bio: Joi.string().min(0).max(200),
    username: Joi.string().min(3),
});


// Validation schema for add contact
export const addContactSchema = Joi.object({
    friendId: Joi.string().required(),
});

// Validation schema for send message
export const sendMessageSchema = Joi.object({
    text: Joi.string(),
    image: Joi.string(),
});