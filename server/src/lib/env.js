import "dotenv/config";
export const NODE_ENV = process.env.NODE_ENV;
export const MONGO_URL = NODE_ENV === "development" ? "mongodb://localhost:27017/chat" : process.env.MONGODB_URL;
export const CORS_URL = NODE_ENV === "development" ? process.env.CORS_URL : "/";
export const JWT_SECRET = process.env.JWT_SECRET;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const PORT = process.env.PORT || 8000;
