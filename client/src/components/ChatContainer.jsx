import { useEffect } from "react";
import { useChatStore } from "../store";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";

function ChatContainer() {
    const selectedContact = useChatStore((state) => state.selectedContact);
    const getMessages = useChatStore((state) => state.getMessages);
    const isChatLoading = useChatStore((state) => state.isChatLoading);
    const messages = useChatStore((state) => state.messages);

    useEffect(() => {
        if (!selectedContact) return;
        getMessages(selectedContact._id);
    }, [selectedContact]);

    if (isChatLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton size={6} />
                <MessageInput/>
            </div>
        );
    }
    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />

            <p>messages....... </p>

            <MessageInput />
        </div>
    );
}

export default ChatContainer;
