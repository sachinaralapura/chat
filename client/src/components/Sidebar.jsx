import { useAuthStore, useChatStore, useUserStore } from "../store";
import { EllipsisVertical, Handshake, UserMinus, UserPlus, Users } from "lucide-react";
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
    const blockContact = useUserStore((state) => state.blockContact);
    const [showOnline, setShowOnline] = useState(false)

    const filteredUser = useMemo(() => {
        if (!showOnline) return contacts.filter((user) => user.blocked === false);
        return contacts.filter((user) => onlineUsers.includes(user._id) && user.blocked === false);
    }, [contacts, showOnline]);



    useEffect(() => {
        if (!authUser) return;
        getContacts();
    }, [authUser]);

    const handleBlock = async (id, block, username) => {
        await blockContact(id, block, username);
        getContacts();
    }

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

            <div className="overflow-y-auto w-full flex-1 list">
                {/* <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">contacts</li> */}
                {
                    filteredUser.length === 0 && showOnline && (
                        <div className="p-3 text-center text-zinc-500">
                            No online users
                        </div>
                    )
                }
                {filteredUser.map((user) => (
                    <ul
                        key={user._id}
                        onClick={() => setSelectedContact(user)}
                        className={`list-row items-center  hover:bg-base-300 ${selectedContact?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}`} >
                        {/* avatar */}
                        <div className={`avatar avatar-placeholder indicator  ${onlineUsers.includes(user._id) && "avatar-online"} relative mx-auto lg:mx-0`} >
                            <div className="w-8 lg:w-12 rounded-full">
                                {/* <span className="indicator-item indicator-bottom indicator-center badge">{user.username}</span> */}
                                <img
                                    src={user.profilePicture || DEFAULT_IMG}
                                    alt={user.username}
                                    className="size-12 object-cover rounded-full w-16"
                                />
                            </div>
                        </div>

                        {/* info */}
                        <div className="hidden lg:block">
                            <div className="font-bold">{user.username}</div>
                            <div className="text-sm font-light text-zinc-500">{user.email}</div>
                        </div>

                        {/* options */}
                        <button onClick={(e) => e.stopPropagation()} className="hidden lg:block p-2" popoverTarget="popover-1" style={{ anchorName: "--anchor-1" }}>
                            <EllipsisVertical className="size-5" />
                            <ul className="dropdown menu w-52 sm:w-110 rounded-box bg-base-100/50 shadow-sm backdrop-blur-2xl flex flex-col gap-2"
                                popover="auto" id="popover-1" style={{ positionAnchor: "--anchor-1" }}>
                                <li className="menu-title">options</li>
                                {/* ------------------ TODO --------------- */}
                                <li className="bg-base-100/60 hover:bg-accent/80 text-base-content py-3 rounded-md font-medium">remove contact <span className="inline text-error">TODO</span></li>
                                <li className="bg-base-100/60 hover:bg-error/80 text-base-content py-3 rounded-md font-medium" onClick={() => handleBlock(user._id, true, user.username)}>block</li>
                            </ul>
                        </button>
                    </ul>
                ))}
            </div>

            {authUser && (
                <div className="flex flex-col flex-none w-full  gap-2 ">
                    <button
                        title="add new contact"
                        className="btn btn-primary btn-soft w-full p-2 lg:p-3 relative"
                        onClick={() => document.getElementById("requests-modal").showModal()}
                    >
                        <Handshake className="size-5" />
                        <span className="hidden lg:block text-lg">Requests</span>
                        {
                            authUser?.requests?.length > 0 &&
                            <span className="status status-success absolute right-3"></span>}
                    </button>

                    {/* add new cantact */}
                    <button
                        title="add new contact"
                        className="btn btn-primary btn-soft w-full p-2 lg:p-3"
                        onClick={() => document.getElementById("new-contact").showModal()}
                    >
                        <UserPlus className="size-5" />
                        <span className="hidden lg:block text-lg">Add contact</span>
                    </button>


                    {/* blocked list */}
                    <button
                        title="blocked list"
                        className="btn btn-primary btn-soft w-full p-2 lg:p-3 hover:btn-error"
                        onClick={() => document.getElementById("blocked-modal").showModal()}
                    >
                        <UserMinus className="size-5" />
                        <span className="hidden lg:block text-lg">Blocked</span>
                    </button>
                </div>
            )}

        </aside>
    );
}

export default ChatSidebar;
