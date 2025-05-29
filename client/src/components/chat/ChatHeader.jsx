import { X } from "lucide-react";
import { useAuthStore, useChatStore } from "../../store";
import { DEFAULT_IMG } from "../../contants";

const ChatHeader = () => {
    const selectedContact = useChatStore((state) => state.selectedContact);
    const setSelectedContact = useChatStore((state) => state.setSelectedContact);
    const { onlineUsers } = useAuthStore();

    return (
        <div className="p-1 border-b border-base-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="avatar">
                        <div className="size-9 lg:size-10 rounded-full relative">
                            <img
                                src={selectedContact.profilePicture || DEFAULT_IMG}
                                alt={selectedContact.username}
                            />
                        </div>
                    </div>

                    {/* User info */}
                    <div>
                        <h3 className="font-medium">{selectedContact.username}</h3>
                        <p className="text-sm text-base-content/70">
                            {/* {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"} */}
                        </p>
                    </div>
                </div>

                {/* Close button */}
                <button onClick={() => setSelectedContact(null)}>
                    <X />
                </button>
            </div>
        </div>
    );
};
export default ChatHeader;
