import { create } from "zustand";
import { axiosObj } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { ErrorToast } from "../lib/utils";


const SOCKET_URL = import.meta.env.VITE_SOCKET_BASE_URL;

const useAuthStore = create((set, get) => (
    {
        authUser: null,  // store the authenticated user
        isSigningUp: false, // store the signup status
        isLoggingIn: false, // store the login status
        isUpdatingProfile: false, // store the profile update status
        isCheckingAuth: true, // store the auth check status

        socket: null,
        onlineUsers: [],
        // cehck if the user is authenticated
        checkAuth: async () => {
            const connectSocket = get().connectSocket;
            set({ isCheckingAuth: true })
            try {
                const res = await axiosObj.get(`/auth/check`);
                set({ authUser: res.data.user })
                connectSocket();
            } catch (err) {
                console.log(err);
                set({ isCheckingAuth: false })
                set({ authUser: null })
            } finally {
                set({ isCheckingAuth: false })
            }
        },

        connectSocket: () => {
            const authUser = get().authUser;
            const soc = get().socket;
            // return if user is not authenticated or socket is already connected 
            if (!authUser || soc?.connected) return;
            // create socket
            const socket = io(SOCKET_URL, {
                query: {
                    userId: authUser._id
                }
            });

            // connect socket
            socket.connect()
            set({ socket });

            // listen for ONLINE-USERS events
            socket.on("ONLINE-USERS", (onlineUsers) => {
                set({ onlineUsers: onlineUsers })
            })

            socket.on("SOMEONE-ONLINE", (id) => {
                set({ onlineUsers: get().onlineUsers.includes(id) ? get().onlineUsers : [...get().onlineUsers, id] })
            })

            socket.on("SOMEONE-OFFLINE", (id) => {
                set({ onlineUsers: get().onlineUsers.filter(u => u !== id) })
            })
        },

        disconnectSocket: () => {
            const { socket: soc } = get();
            // return if socket is not connected
            if (!soc?.connected) return;

            // disconnect socket
            soc.disconnect();
        },

        // sign up a new user
        signUp: async (data) => {
            const connectSocket = get().connectSocket
            set({ isSigningUp: true })
            try {
                const res = await axiosObj.post(`/auth/signup`, data);
                set({ authUser: res.data.user })
                toast.success(res.data.message);
                connectSocket();
            } catch (err) {
                console.log(err);
                set({ authUser: null })
                ErrorToast(err);
            } finally {
                set({ isSigningUp: false })
            }
        },

        // login a user
        login: async (data) => {
            const connectSocket = get().connectSocket;
            set({ isLoggingIn: true });
            try {
                const res = await axiosObj.post(`/auth/login`, data);
                set({ authUser: res.data.user });
                toast.success(res.data.message);
                connectSocket();
            } catch (err) {
                console.log(err);
                set({ authUser: null });
                ErrorToast(err);
            } finally {
                set({ isLoggingIn: false })
            }
        },

        // logout
        logout: async () => {
            const disconnectSocket = get().disconnectSocket;
            try {
                const res = await axiosObj.get(`/auth/logout`);
                set({ authUser: null });
                toast.success(res.data.message);
                disconnectSocket();
            } catch (err) {
                console.log(err);
            }
        },

        // update profile
        updateProfile: async (data) => {
            set({ isUpdatingProfile: true });
            try {
                const res = await axiosObj.patch(`/user/update-profile`, data);
                set({ authUser: res.data.user });
                toast.success(res.data.message);
            } catch (err) {
                console.log(err);
                ErrorToast(err);
            } finally {
                set({ isUpdatingProfile: false })
            }
        },

        // remove profile image
        removeProfileImage: async () => {
            set({ isUpdatingProfile: true });
            try {
                const res = await axiosObj.patch(`/user/remove-profile-image`);
                set({ authUser: res.data.user });
                toast.success(res.data.message);
            } catch (err) {
                console.log(err);
                toast.error(err.response.data.message);
            } finally {
                set({ isUpdatingProfile: false })
            }
        }
    }
))

export default useAuthStore