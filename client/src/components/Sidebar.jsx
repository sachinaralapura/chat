import { useAuthStore, useChatStore } from "../store";
import { Users } from "lucide-react";
import { useEffect } from "react";
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

    // console.log(onlineUsers, "new state");


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
                </div>
                {/* TODO: Online filter toggle */}
                {/* <div className="mt-3 hidden lg:flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                            className="checkbox checkbox-sm"
                        />
                        <span className="text-sm">Show online only</span>
                    </label>
                    <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
                </div> */}
            </div>

            <div className="overflow-y-auto w-full">
                {contacts.map((user) => (
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
