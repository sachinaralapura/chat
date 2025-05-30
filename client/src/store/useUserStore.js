import { create } from "zustand";
import { ErrorToast } from "../lib/utils";
import { axiosObj } from "../lib/axios";
import toast from "react-hot-toast";

const useUserStore = create((set) => ({
    requests: null,
    isFetchingRequests: false,

    getRequests: async () => {
        set({ isFetchingRequests: true })
        try {
            const res = await axiosObj.get(`/user/get-requested-contacts`);
            set({ requests: res.data.requests });
        } catch (err) {
            console.error(err);
            ErrorToast(err);
        } finally {
            set({ isFetchingRequests: false })
        }
    },

    rejectRequest: async (id) => {
        try {
            const res = await axiosObj.post(`/user/reject-request`, { friendId: id });
            toast.success(res.data.message);
        } catch (err) {
            consoleerror(err);
            ErrorToast(err);
        }
    },

    blockContact: async (id, block, username = "this user") => {
        try {
            const res = await axiosObj.post(`/user/block`, { friendId: id, block });
            toast.success("You have " + (block ? "blocked" : "unblocked") + " " + username);
        } catch (err) {
            console.error(err);
            ErrorToast(err);
        }
    }
}));

export default useUserStore