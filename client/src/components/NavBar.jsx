import { Pause, Play, User, LogOut, Palette, PlusCircle } from "lucide-react";
import usePreference from "../store/usePreference";
import { Logo } from "./ui/Logo";
import { useAuthStore } from "../store";
import { useNavigate } from "react-router-dom";
function NavBar() {
    const AuthUser = useAuthStore((state) => state.authUser);
    const logout = useAuthStore((state) => state.logout);
    const toggleParticle = usePreference((state) => state.toggleParticle);

    const navigate = useNavigate();

    return (
        <div className="navbar absolute z-10 gap-2 bg-base-300/70  backdrop-blur-xs">
            {/* logo */}
            <div className="navbar-start flex-1 gap-2 items-center justify-baseline ">
                <Logo onClick={() => navigate("/")} />
                <span
                    className="font-bold text-2xl text-primary hover:cursor-pointer  "
                    onClick={() => navigate("/")}
                >
                    <span className="hidden sm:inline">Chat</span>
                </span>
            </div>

            {/* add new cantact */}
            {AuthUser && (
                <div className="flex-none mr-5">
                    <button
                        title="add new contact"
                        className="btn btn-primary btn-soft rounded-md"
                        onClick={() => document.getElementById("new_contact").showModal()}
                    >
                        <PlusCircle className="size-5" />
                        <span className="hidden sm:inline">Add contact</span>
                    </button>
                </div>
            )}

            {/* particle play and pause */}
            {!AuthUser && (
                <div className="flex-none mr-5">
                    <label
                        title="toggle particles"
                        className="swap swap-rotate hover:cursor-pointer"
                    >
                        <input
                            type="checkbox"
                            className="theme-controller"
                            onClick={toggleParticle}
                        />

                        <Play className="swap-on size-8 text-primary fill-primary" />
                        <Pause className="swap-off size-8 text-primary fill-primary" />
                    </label>
                </div>
            )}

            {/* themes */}
            <div className="flex-none mr-5">
                <button
                    title="change theme"
                    className="btn btn-primary btn-soft rounded-md "
                    onClick={() => navigate("/settings")}
                >
                    <Palette className="size-5" />
                    <span className="hidden sm:inline">themes</span>
                </button>
            </div>

            {/* profile */}
            {AuthUser && (
                <div className="flex-none mr-5">
                    <button
                        title="show profile"
                        onClick={() => navigate("/profile")}
                        className="btn btn-primary btn-soft rounded-md"
                    >
                        <User className="size-5" />
                        <span className="hidden sm:inline">profile</span>
                    </button>
                </div>
            )}

            {/* logout */}
            {AuthUser && (
                <div className="flex-none">
                    <button
                        title="logout"
                        onClick={logout}
                        className="btn btn-primary hover:btn-error btn-soft rounded-md"
                    >
                        <LogOut className="size-5" />
                        <span className="hidden sm:inline">logout</span>
                    </button>
                </div>
            )}
        </div>
    );
}

export default NavBar;
