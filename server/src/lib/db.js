import mongoose from "mongoose";
import { MONGO_URL } from "./env.js";

export const connectMongo = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URL);
        console.log(`mongodb connected ${conn.connection.host}`);
    } catch (err) {
        console.error(err);
    }
};
