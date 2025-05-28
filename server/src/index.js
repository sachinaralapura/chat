import "dotenv/config";
import express from "express";
import { connectMongo } from "./lib/db.js";
import { devrouter, authRouter, userRouter, messageRouter } from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, httpserver } from "./lib/socketio.js";

// set routers
function apiV1Router(app) {
    // v1 router
    const router = express.Router();
    // development routers
    if (process.env.NODE_ENV === "development") {
        router.use("/", devrouter);
    }
    // routers
    router.use("/auth", authRouter);
    router.use("/user", userRouter);
    router.use("/message", messageRouter);

    // mount router to app router
    app.use("/api/v1", router);
}

//set middlewares
function setMiddlewares(app) {
    app.use(express.json({ limit: "15mb" }));
    app.use(cookieParser());
    app.use(cors({ origin: process.env.CORS_URL, credentials: true }));
}

function main() {
    setMiddlewares(app);
    apiV1Router(app);

    const PORT = process.env.PORT || 8000;
    httpserver.listen(PORT, () => {
        connectMongo();
        console.log(`app running on ${PORT}`);
    });
}

main();
