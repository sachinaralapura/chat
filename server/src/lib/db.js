import mongoose from "mongoose";

export const connectMongo = async () => {
    try {
        const MONGO_URL = process.env.MONGODB_URL;
        const conn = await mongoose.connect(MONGO_URL);
        console.log(`mongodb connected ${conn.connection.host}`);
    } catch (err) {
        console.error(err);
    }
};
