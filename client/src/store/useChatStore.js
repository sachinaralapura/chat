import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosObj } from "../lib/axios";

const useChatStore = create((set, get) => ({
    messages: [],   // store  the messages of selected contact
    contacts: [],  // store the contacts
    searchUsers: [], // store the search results
    onlineUsers: [], // store the online users

    selectedContact: null,
    isContactsLoading: false,
    isChatLoading: false,
    isAddingContact: false,
    isSearchingContact: false,

    setSelectedContact: (contact) => {
        set({ selectedContact: contact })
    },

    getContacts: async () => {
        set({ isContactsLoading: true })
        try {
            const res = await axiosObj.get(`/user/contacts`);
            set({ contacts: res.data.contacts });
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message);
        } finally {
            set({ isContactsLoading: false })
        }
    },

    addContact: async (contact_id) => {
        set({ isAddingContact: true })
        try {
            const res = await axiosObj.post(`/user/add-contact`, { friendId: contact_id });
            set({ contacts: res.data.contacts });
            toast.success(res.data.message);
        } catch (err) {
            console.error(err);
            toast.error(err.response.data.message);
        } finally {
            set({ isAddingContact: false })
        }
    },

    // search users by email
    UsersSearch: async (email) => {
        set({ isSearchingContactsr: true })
        // send email as query parameter
        try {
            const res = await axiosObj.get(`/user/search-users?email=${email}`);
            set({ searchUsers: res.data.users });
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message);
        }
        finally {
            set({ isSearchingContacts: false })
        }
    },


    getMessages: async (contactId) => {
        set({ isChatLoading: true })
        try {
            const res = await axiosObj.get(`/message/get-conversation/${contactId}`);
            set({ messages: res.data.messages });
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message);
        } finally {
            set({ isChatLoading: false })
        }
    },

    sendMessages: async (data) => {
        const { selectedContact, messages } = get();
        try {
            const res = await axiosObj.post(`/message/send/${selectedContact._id}`, data);
            set({ messages: [...messages, res.data.message] });
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message);
        }
    },



}));

export default useChatStore