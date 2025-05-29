import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import path from "path";
import { connectMongo } from "./lib/db.js";
import { app, httpserver } from "./lib/socketio.js";
import { authRouter, messageRouter, userRouter } from "./routes/index.js";

const __dirname = path.resolve();

// set routers
function apiV1Router(app) {
    // v1 router
    const router = express.Router();
    // mount routes
    router.use("/auth", authRouter);
    router.use("/user", userRouter);
    router.use("/message", messageRouter);

    // mount router to app router
    app.use("/api/v1", router);
}

//set middlewares
function setMiddlewares(app) {
    const cors_url = process.env.NODE_ENV === "development" ? process.env.CORS_URL : "/";
    app.use(express.json({ limit: "15mb", extended: true }));
    app.use(cookieParser());
    app.use(cors({ origin: cors_url, credentials: true }));
}

function main() {

    // set middlewares
    setMiddlewares(app);
    // set up all the api for backend
    apiV1Router(app);

    // serve static files in production
    if (process.env.NODE_ENV === "production") {
        app.use(express.static(path.join(__dirname, "../client/dist")));
        app.get('/{*splat}', (req, res) => {
            try {
                return res.sendFile(path.join(__dirname, "../client/dist"));
            } catch (err) {
                console.log(err);
            }
        })
    }

    const PORT = process.env.PORT || 8000;
    httpserver.listen(PORT, () => {
        connectMongo();
        console.log(`app running on ${PORT}`);
    });
}

main();
