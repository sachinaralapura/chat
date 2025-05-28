import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import "./index.css";
import { HomePage, LoginPage, ProfilePage, SettingsPage, SignUpPage } from "./pages";
import { useAuthStore, useChatStore, usePreferenceStore } from "./store";
import MyToaster from "./components/Toaster";
import NewContactModel from "./components/NewContactModel";

function App() {

    const { authUser, isCheckingAuth, checkAuth } = useAuthStore();
    const initTheme = usePreferenceStore((state) => state.initTheme);

    const [isOnline, setIsOnline] = useState(navigator.onLine);
    useEffect(() => {
        if (!isOnline) {
            toast.error("You are offline");
        }
        const handleOnline = () => {
            setIsOnline(true);
            toast.success("You are online");
        };
        const handleOffline = () => {
            setIsOnline(false);
            toast.error("You are offline");
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", () => setIsOnline(true));
            window.removeEventListener("offline", () => setIsOnline(false));
        };
    }, []);

    useEffect(() => {
        checkAuth();
        initTheme();
    }, [checkAuth, initTheme]);

    if (isCheckingAuth && !authUser) {
        return (
            <div className="flex items-center justify-center h-screen transition-colors">
                <Loader className="size-10 animate-spin" />
            </div>
        );
    }
    return (
        <div>
            <NavBar />
            <Routes>
                <Route path="/" element={authUser ? <HomePage /> : <Navigate to={"/login"} />} />
                <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
                <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
                <Route path="/settings" element={<SettingsPage />} />

                <Route
                    path="/profile"
                    element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
                />
            </Routes>
            <NewContactModel />
            <MyToaster />
        </div>
    );
}

export default App;
