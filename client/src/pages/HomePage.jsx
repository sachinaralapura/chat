import { useAuthStore, useChatStore } from "../store/";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/chat/NoChatSelected";
import ChatContainer from "../components/chat/ChatContainer";
import { useEffect } from "react";

const HomePage = () => {
    const authUser = useAuthStore((state) => state.authUser);

    const getContacts = useChatStore((state) => state.getContacts);
    const selectedContact = useChatStore((state) => state.selectedContact);

    useEffect(() => {
        if (!authUser) return;
        getContacts();
    }, [authUser]);

    return (
        <div className="h-screen bg-base-100">
            <div className="flex items-center justify-center pt-16 ">
                <div className="bg-base-100 rounded-lg shadow-2xl w-full mt-5 mx-5 h-[calc(100vh-6rem)]">
                    <div className="flex h-full rounded-lg  overflow-hidden ">
                        <Sidebar />
                        {!selectedContact ? <NoChatSelected /> : <ChatContainer />}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default HomePage;
