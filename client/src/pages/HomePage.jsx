import { useAuthStore, useChatStore } from "../store/";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
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
        <div className="h-screen  bg-base-200">
            <div className="flex items-center justify-center pt-16 ">
                <div className="bg-base-100 rounded-lg shadow-cl w-full m-5 h-[calc(100vh-7rem)]">
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
