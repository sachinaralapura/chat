import { useEffect, useMemo } from "react";
import { useAuthStore, useChatStore } from "../store";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { DEFAULT_IMG } from "../contants"
import { FormatDate } from "../lib/utils";
function ChatContainer() {
    const authUser = useAuthStore((state) => state.authUser);
    const selectedContact = useChatStore((state) => state.selectedContact);
    const getMessages = useChatStore((state) => state.getMessages);
    const isChatLoading = useChatStore((state) => state.isChatLoading);
    const messages = useChatStore((state) => state.messages);

    useEffect(() => {
        if (!selectedContact) return;
        getMessages(selectedContact._id);
    }, [selectedContact]);

    const senderImg = useMemo(() => {
        return authUser.profilePicture || DEFAULT_IMG;
    }, [authUser]);

    const receiverImg = useMemo(() => {
        return selectedContact.profilePicture || DEFAULT_IMG;
    }, [selectedContact]);

    if (isChatLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton size={6} />
                <MessageInput />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-auto relative">
            <ChatHeader />

            <div className="flex-1 overflow-auto p-4 mb-10 space-y-4">
                {messages.map((msg) => (
                    <div key={msg._id} className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"} pb-4`} >

                        {/* chat image */}
                        <div className="chat-image avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="user"
                                    src={msg.senderId === authUser._id ? senderImg : receiverImg}
                                />
                            </div>
                        </div>
                        {/* chat header */}
                        <div className="chat-header">
                            {FormatDate(msg.createdAt)}
                        </div>

                        {/* chat message */}
                        <div className={`chat-bubble flex-col ${msg.senderId === authUser._id && "chat-bubble-primary"} rounded-xl shadow-xl`}>
                            {msg.image && (<img src={msg.image} alt="attachment" className=" sm:max-w-[300px]  rounded-md mb-2" />)}
                            {msg.text && (<p>{msg.text}</p>)}
                        </div>

                    </div>
                ))}
            </div>

            <MessageInput />
        </div >
    );
}

export default ChatContainer;
