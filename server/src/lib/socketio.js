import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { GetUserContactsId } from "../services/user_service.js";
import { ONLINEUSERS, SOMEONEOFFLINE, SOMEONEONLINE } from "../lib/constants.js";
import { CORS_URL } from "./env.js";

const app = express();
const httpserver = createServer(app);

// socket server
const io = new Server(httpserver, {
    cors: {
        origin: [CORS_URL],
        credentials: true,
    },
});

// map of userId and all the devices they have loggedIn
// userId -> [socketid1 , socketid2 , .....];
const onlineUserMap = new Map();

// listen to "connection" event
io.on("connection", async (socket) => {
    // get the userId
    const userId = socket.handshake.query.userId;
    // console.log(`User ${userId} connected with socket ${socket.id}`);
    // if there is no userId
    if (!userId) {
        console.warn(`connection rejected: userId not provided in handshake query`);
        socket.disconnect();
        return;
    }

    // add the userId and socketId to onlineUserMap
    if (!onlineUserMap.has(userId)) {
        onlineUserMap.set(userId, new Set());
    }
    onlineUserMap.get(userId).add(socket.id);

    // array id's of userId's contacts
    const contacts = await GetUserContactsId(userId);

    // notify the user with userId with all the online users in their contact
    // emit "ONLINE-USER" event to all devices userId has logged in
    // send [onlineuser1 , onlineuser2 , onlineuser3 , onlineuser4 , .....] ==to=> [usesrIdSocket1, usesrIdSocket2 ,usesrIdSocket3,....];
    notifyOnlineUsers(userId, contacts);

    // notify all the users in the "userId's" contact that "userId" is online
    // send userId ==to=> [...user1AllSocket , ...user2AllSocket ,...user3AllSocket ,...user4AllSocket]
    notifyUserContact(userId, contacts, SOMEONEONLINE);
    //---------------------------------------------
    // listen to "disconnect" event
    socket.on("disconnect", () => {
        // console.log(`User ${userId} disconnected with socket ${socket.id}`);
        if (onlineUserMap.has(userId)) {
            const socketsOfUser = onlineUserMap.get(userId);
            socketsOfUser.delete(socket.id);

            // no devices of the user is online
            if (socketsOfUser.size === 0) {
                // delete the userId
                onlineUserMap.delete(userId);

                // Notify contacts of this user about their offline status
                // send userId ==to=> [...user1AllSocket , ...user2AllSocket ,...user3AllSocket ,...user4AllSocket]
                notifyUserContact(userId, contacts, SOMEONEOFFLINE);
            }
        }
    });
});

// --------------------------------------------------------
// send all the contact who are online to the user;
function notifyOnlineUsers(userId, contacts) {
    try {
        let onlineUsers = [];
        for (const contact of contacts) {
            if (onlineUserMap.has(contact)) {
                onlineUsers.push(contact);
            }
        }
        // emit "ONLINE-USERS" event to all devices userId has logged in
        const userSockets = onlineUserMap.get(userId);
        for (const soc of userSockets) {
            io.to(soc).emit(ONLINEUSERS, onlineUsers);
        }
    } catch (err) {
        console.error(err);
    }
}

// notify all the users in the "userId's" contact that "userId" is online
// all the devices are notified
function notifyUserContact(userId, contacts, event) {
    try {
        let socketsToNotify = [];
        // get all the sockets of all the contacts who are online
        for (const contact of contacts) {
            if (onlineUserMap.has(contact)) {
                socketsToNotify.push(...onlineUserMap.get(contact));
            }
        }

        for (const soc of socketsToNotify) {
            io.to(soc).emit(event, userId);
        }
    } catch (err) { }
}

function getAllSocketsOfUser(userId) {
    if (onlineUserMap.has(userId)) {
        return onlineUserMap.get(userId);
    }
    return [];
}

export { app, httpserver, io, getAllSocketsOfUser };
