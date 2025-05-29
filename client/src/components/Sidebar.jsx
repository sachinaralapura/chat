import { useAuthStore, useChatStore } from "../store";
import { Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { DEFAULT_IMG } from "../contants";
// sidebar for chat , contains list of users
function ChatSidebar() {
    const authUser = useAuthStore((state) => state.authUser);
    const contacts = useChatStore((state) => state.contacts);
    const getContacts = useChatStore((state) => state.getContacts);
    const isContactsLoading = useChatStore((state) => state.isContactsLoading);
    const selectedContact = useChatStore((state) => state.selectedContact);
    const setSelectedContact = useChatStore((state) => state.setSelectedContact);
    const onlineUsers = useAuthStore((state) => state.onlineUsers);

    const [showOnline, setShowOnline] = useState(false)

    const filteredUser = useMemo(() => {
        if (!showOnline) return contacts;
        return contacts.filter((user) => onlineUsers.includes(user._id));
    }, [contacts, showOnline]);

    useEffect(() => {
        if (!authUser) return;
        getContacts();
    }, [authUser]);

    if (isContactsLoading) {
        return (
            <aside className="border-r border-base-300 flex flex-col transition-all duration-200">
                <SidebarSkeleton />
                <SidebarSkeleton />
                <SidebarSkeleton />
                <SidebarSkeleton />
            </aside>
        );
    }

    return (
        <aside className="h-full w-20 lg:w-72 border-r border-base-300 bg-base-200 flex flex-col transition-all duration-200">
            <div className="border-b border-base-300 w-full p-3">
                <div className="flex items-center gap-2">
                    <Users className="size-5" />
                    <span className="font-medium hidden lg:block">Contacts</span>
                    <span className="text-xs text-zinc-500 ">
                        ({contacts.length})
                    </span>
                    <label className="label hidden lg:block flex-1 text-end">
                        online
                        <input type="checkbox" onChange={(e) => setShowOnline(e.target.checked)} className="ml-2 toggle toggle-success toggle-sm" />
                    </label>
                </div>
            </div>

            <div className="overflow-y-auto w-full">

                {
                    filteredUser.length === 0 && showOnline && (
                        <div className="p-3 text-center text-zinc-500">
                            No online users
                        </div>
                    )
                }

                {filteredUser.map((user) => (
                    <button
                        key={user._id}
                        onClick={() => setSelectedContact(user)}
                        className={`w-full p-2 lg:p-3 flex items-center gap-3 hover:bg-base-300 transition-colors  ${selectedContact?._id === user._id
                            ? "bg-base-300 ring-1 ring-base-300" : ""}`} >
                        {/* avatar */}
                        <div className={`avatar avatar-placeholder indicator  ${onlineUsers.includes(user._id) && "avatar-online"} relative mx-auto lg:mx-0`} >
                            <div className="w-8 lg:w-12 rounded-full">
                                {/* <span className="indicator-item indicator-bottom indicator-center badge">{user.username}</span> */}
                                <img
                                    src={user.profilePic || DEFAULT_IMG}
                                    alt={user.username}
                                    className="size-12 object-cover rounded-full w-16"
                                />
                            </div>
                        </div>

                        {/* info */}
                        <div className="hidden lg:block">
                            <div className="font-medium">{user.username}</div>
                            <div className="text-xs text-zinc-500">{user.email}</div>
                        </div>
                    </button>
                ))}

                {contacts?.length === 0 && (
                    <div className="text-center text-zinc-500 py-4">No users</div>
                )}
            </div>
        </aside>
    );
}

export default ChatSidebar;
