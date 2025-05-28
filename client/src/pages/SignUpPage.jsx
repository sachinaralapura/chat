import { useState } from "react";
import { useAuthStore } from "../store";
import { Mail, User, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Parti from "../components/ui/Particles";
import usePreference from "../store/usePreference";

function SignUpPage() {
    const particle = usePreference((state) => state.particle);
    const [showPasword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const validate = () => {
        if (!formData.username.trim()) return toast.error("Username is required");
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!formData.password.trim()) return toast.error("Password is required");
        if (formData.password.length < 6)
            return toast.error("Password must be at least 6 characters");
        return true;
    };

    const signUp = useAuthStore((state) => state.signUp);
    const isSigningUp = useAuthStore((state) => state.isSigningUp);

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = validate();
        if (success) {
            signUp(formData);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center pb-20 ">
            {/* particle js */}
            {particle && <Parti />}
            {/* Main Content - Sign Up Card */}
            <main className="card  w-full max-w-md shadow-lg p-4 z-10 bg-base-300/30 backdrop-blur-sm">
                <form className="card-body space-y-6" onSubmit={handleSubmit}>
                    <h1 className="card-title text-2xl font-bold  mb-4 justify-center">
                        Create your account
                    </h1>
                    {/* Username Input */}
                    <label
                        htmlFor="username"
                        className="input input-ghost w-full border-primary/40 rounded-md"
                    >
                        <span>
                            <User className="size-5 text-base-content/40" />
                        </span>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            placeholder="Enter your username"
                            required
                        />
                    </label>
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
                    {/* Sign Up Button */}
                    <button
                        type="submit"
                        className="btn btn-soft btn-primary w-full rounded-md" // Added h-auto for consistent height with py-3
                        disabled={isSigningUp}
                    >
                        {isSigningUp ? (
                            <Loader2 className="size-5 animate-spin mr-2 text-primary" />
                        ) : (
                            "Sign Up"
                        )}
                    </button>
                </form>

                {/* Sign In Link */}
                <p className="mt-5 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to={"/login"} className="link link-primary">
                        Sign in
                    </Link>
                </p>
            </main>
        </div>
    );
}

export default SignUpPage;
