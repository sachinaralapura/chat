import { create } from "zustand";
import { axiosObj } from "../lib/axios";
import toast from "react-hot-toast";


const useAuthStore = create((set) => (
    {
        authUser: null,  // store the authenticated user
        isSigningUp: false, // store the signup status
        isLoggingIn: false, // store the login status
        isUpdatingProfile: false, // store the profile update status
        isCheckingAuth: true, // store the auth check status

        // cehck if the user is authenticated
        checkAuth: async () => {
            try {
                const res = await axiosObj.get(`/auth/check`);
                set({ authUser: res.data.user })
            } catch (err) {
                console.log(err);
                set({ isCheckingAuth: false })
                set({ authUser: null })
            } finally {
                set({ isCheckingAuth: false })
            }
        },

        // sign up a new user
        signUp: async (data) => {
            set({ isSigningUp: true })
            try {
                const res = await axiosObj.post(`/auth/signup`, data);
                set({ authUser: res.data.user })
                toast.success(res.data.message);
            } catch (err) {
                console.log(err);
                set({ authUser: null })
                toast.error(err.response.data.message);
            } finally {
                set({ isSigningUp: false })
            }
        },

        // login a user
        login: async (data) => {
            set({ isLoggingIn: true });
            try {
                const res = await axiosObj.post(`/auth/login`, data);
                set({ authUser: res.data.user });
                toast.success(res.data.message);
            } catch (err) {
                console.log(err);
                set({ authUser: null });
                toast.error(err.response.data.message);
            } finally {
                set({ isLoggingIn: false })
            }
        },

        // logout
        logout: async () => {
            try {
                const res = await axiosObj.get(`/auth/logout`);
                set({ authUser: null });
                toast.success(res.data.message);
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
                toast.error(err.response.data.message);
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