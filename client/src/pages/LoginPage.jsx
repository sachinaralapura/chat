import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Parti from "../components/ui/Particles";
import { useAuthStore } from "../store";
import usePreference from "../store/usePreference";

function LoginPage() {
    const particle = usePreference((state) => state.particle);

    const [showPasword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const validate = () => {
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!formData.password.trim()) return toast.error("Password is required");
        if (formData.password.length < 6)
            return toast.error("Password must be at least 6 characters");
        return true;
    };

    const login = useAuthStore((state) => state.login);
    const isLoggingIn = useAuthStore((state) => state.isLoggingIn);
    const handleSubmit = (e) => {
        e.preventDefault();
        const success = validate();
        if (success) login(formData);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center pb-20 ">
            {/* Particle js */}
            {particle && <Parti />}
            {/* Main Content - login Card */}
            <main className="card  w-full max-w-md shadow-lg p-4 z-10 bg-base-300/30 backdrop-blur-sm">
                <form className="card-body space-y-6" onSubmit={handleSubmit}>
                    <h1 className="card-title text-2xl font-bold  mb-4 justify-center">Login</h1>
                    {/* Email Input */}
                    <label
                        htmlFor="email"
                        className="input input-ghost w-full border-primary/40 rounded-md"
                    >
                        <Mail className="size-5 text-base-content/40" />
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="Enter your email"
                            required
                        />
                    </label>
                    {/* Password Input */}
                    <label
                        htmlFor="password"
                        className=" input input-ghost w-full border-primary/40 rounded-md"
                    >
                        <span>
                            <Lock className="size-5 text-base-content/40 cursor-pointer" />
                        </span>

                        <input
                            type={showPasword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Enter your password"
                            required
                        />
                        <span onClick={() => setShowPassword(!showPasword)}>
                            {showPasword ? (
                                <EyeOff className="size-5 text-base-content/40 cursor-pointer" />
                            ) : (
                                <Eye className="size-5 text-base-content/40 cursor-pointer" />
                            )}
                        </span>
                    </label>
                    {/* login Button */}
                    <button
                        type="submit"
                        className="btn btn-soft btn-primary w-full rounded-md" // Added h-auto for consistent height with py-3
                        disabled={isLoggingIn}
                    >
                        {isLoggingIn ? (
                            <Loader2 className="size-5 animate-spin mr-2 text-primary" />
                        ) : (
                            "Log in"
                        )}
                    </button>
                </form>

                {/* login Link */}
                <p className="mt-5 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link to={"/signup"} className="link link-primary">
                        Sign Up
                    </Link>
                </p>
            </main>
        </div>
    );
}

export default LoginPage;
