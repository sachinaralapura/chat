import { useAuthStore } from "../store";
import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, User, Mail, Phone, Edit, Save, X, Lock, Loader2, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { DEFAULT_IMG } from "../contants";

function ProfilePage() {
    const authUser = useAuthStore((state) => state.authUser);
    const updateProfile = useAuthStore((state) => state.updateProfile);
    const isUpdatingProfile = useAuthStore((state) => state.isUpdatingProfile);
    const removeProfileImage = useAuthStore((state) => state.removeProfileImage);

    const [formData, setFormData] = useState({
        username: authUser.username || "",
        phone: authUser.phone || "",
        profilePicture: authUser.profilePicture || "",
        bio: authUser.bio || "",
    });
    const [image, setImage] = useState(null);

    let isEditing = useMemo(() => {
        const nameChange = authUser.username !== formData.username.trim();
        const phoneChange = (authUser.phone || "") !== (formData.phone || "");
        const bioChange = (authUser.bio || "") !== (formData.bio || "");
        const imageChange = image !== null;
        return nameChange || phoneChange || bioChange || imageChange;
    }, [authUser, formData, image]);

    useEffect(() => {
        if (isUpdatingProfile) return;
        setFormData({
            username: authUser.username || "",
            phone: authUser.phone || "",
            profilePicture: authUser.profilePicture || "",
            bio: authUser.bio || "",
        });
        !isUpdatingProfile && setImage(null);
    }, [isUpdatingProfile]);

    const validate = () => {
        if (!formData.username.trim()) {
            toast.error("Username is required");
            return false;
        }

        if (formData.phone.trim().length > 0) {
            if (
                formData.phone.length < 10 || // Check minimum length
                formData.phone.length > 12 || // Check maximum length (changed from >= 12 to > 12 for clarity)
                !/^\d+$/.test(formData.phone) // Check if it contains only digits
            ) {
                toast.error("Phone number must be 10-12 digits and contain only numbers.");
                return false;
            }
        }
        return true;
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const success = validate();

        if (success) {
            const profileChanges = {};

            if (formData.username !== authUser.username)
                profileChanges.username = formData.username;
            if (formData.phone !== authUser.phone) profileChanges.phone = formData.phone;
            if (formData.bio !== authUser.bio) profileChanges.bio = formData.bio;
            if (image) profileChanges.profilePicture = image;

            // check if any field is empty
            if (profileChanges.username === "") delete profileChanges.username;
            if (profileChanges.profilePicture === "") delete profileChanges.profilePicture;

            updateProfile(profileChanges);
        }
    };

    const handleProfilePictureChange = async (event) => {
        const image = event.target.files[0];
        if (image) {
            if (image.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImage(reader.result);
                };
                reader.readAsDataURL(image);
            } else {
                setImage(null);
                toast.error("Please select an image");
            }
        } else {
            setImage(null);
            toast.error("Please select an image");
        }
    };

    const handleImageDelete = () => {
        if (!authUser.profilePicture) {
            toast.error("No profile picture to delete");
            return;
        }
        if (window.confirm("Are you sure you want to delete your profile picture?")) {
            removeProfileImage();
        }
        setImage(null);
    };

    const handleCancel = () => {
        setImage(null);
        setFormData({
            username: authUser.username || "",
            phone: authUser.phone || "",
            profilePicture: authUser.profilePicture || "",
            bio: authUser.bio || "",
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen dark:bg-base-200">
            <div className="card w-full max-w-2xl dark:bg-base-100 shadow-xl  rounded-md p-6 sm:p-8 overflow-scroll">
                <div className="card-body items-center text-center p-0">
                    <h2 className="card-title text-3xl font-bold text-base-content mb-8">
                        User Profile
                    </h2>

                    {/* Profile Picture Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-center w-full">
                        <div className="avatar relative mb-8 group">
                            <div className="w-36 h-36 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                                <img
                                    src={image || authUser.profilePicture || DEFAULT_IMG}
                                    alt="Profile"
                                    className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => (e.target.src = DEFAULT_IMG)}
                                />
                            </div>
                            {/* Overlay for changing picture with DaisyUI btn and Lucid Icon */}
                            <label
                                htmlFor="avatar-upload"
                                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer btn btn-ghost btn-circle"
                                aria-label="Change profile picture"
                            >
                                <Camera size={24} className="hover:text-accent" />
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    className="hidden"
                                    onChange={handleProfilePictureChange}
                                    accept="image/*"
                                />
                            </label>
                            <label
                                className="absolute top-0 right-[-10px] flex items-center justify-center bg-black bg-opacity-50 text-white text-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer btn btn-ghost btn-circle"
                                aria-label="delete profile picture"
                            >
                                <Trash
                                    size={24}
                                    className="hover:text-red-500 hover:scale-110"
                                    onClick={handleImageDelete}
                                />
                            </label>
                        </div>
                        {/* Divider */}
                        <div className="divider divider-vertical sm:divider-horizontal h-full w-full text-base-content/40"></div>
                        {/* account infomation */}
                        <div className="text-left w-full">
                            <div className="flex justify-between">
                                <p className="text-lg text-base-content/40 mb-2">Name</p>
                                <h3 className="text-2xl font-bold  text-base-content/40 mb-2">
                                    {authUser.username}
                                </h3>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-lg text-base-content/40 mb-2">Email</p>
                                <p className="text-lg text-right text-base-content/40 mb-2">
                                    {authUser.email}
                                </p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-lg text-base-content/40 mb-2">Phone</p>
                                <p className="text-lg text-right text-base-content/40 mb-2">
                                    {authUser.phone}
                                </p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-lg text-base-content/40 mb-2">account status </p>
                                <span
                                    aria-label="success"
                                    className="status status-lg status-success  "
                                ></span>
                            </div>
                        </div>
                    </div>

                    {/* Profile Details Form */}
                    <form className="w-full space-y-6">
                        {/* Username Field */}
                        <fieldset className="fieldset ">
                            <legend className="fieldset-legend font-bold">UserName</legend>
                            <label className="input input-ghost w-full border-primary/30 rounded-md">
                                <User className="size-6 mr-3" />
                                <input
                                    type="text"
                                    id="username"
                                    placeholder="Your Username"
                                    className={`w-full`}
                                    value={formData.username}
                                    onChange={(e) =>
                                        setFormData({ ...formData, username: e.target.value })
                                    }
                                />
                            </label>
                        </fieldset>

                        {/* Email Field (Read-only) */}
                        <fieldset className="fieldset ">
                            <legend className="fieldset-legend font-bold">Email</legend>
                            <label className="input input-ghost w-full border-primary/30 rounded-md">
                                <Mail className="size-6 mr-3" />
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Your Email Address"
                                    className={`w-full`}
                                    value={authUser.email}
                                    readOnly
                                />
                                <Lock className="size-6" />
                            </label>
                        </fieldset>

                        {/* Phone Field */}
                        <fieldset className="fieldset ">
                            <legend className="fieldset-legend font-bold">Phone</legend>
                            <label className="input input-ghost w-full border-primary/30 rounded-md">
                                <Phone className="size-5 mr-3" />
                                <input
                                    type="tel"
                                    id="phone"
                                    placeholder="Your phone number"
                                    className={`w-full`}
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }
                                />
                            </label>
                        </fieldset>

                        {/* Bio Field */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend font-bold">Bio</legend>

                            <textarea
                                id="bio"
                                placeholder="Tell us about yourself..."
                                className={`w-full textarea h-24 border-primary/30`}
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            />
                        </fieldset>
                    </form>

                    {/* Action Buttons */}
                    <div className="card-actions justify-center mt-8 w-full">
                        {!isEditing ? (
                            <button
                                onClick={() => { }}
                                className="btn btn-primary btn-wide flex items-center gap-2 rounded-md"
                            >
                                <Edit size={20} /> Edit Profile
                            </button>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center-safe items-center">
                                <button
                                    onClick={handleSave}
                                    className="btn btn-success btn-wide flex items-center gap-2 rounded-md"
                                >
                                    {isUpdatingProfile ? (
                                        <Loader2 className="size-5 animate-spin mr-2 text-primary" />
                                    ) : (
                                        <>
                                            <Save size={20} /> Save Changes{" "}
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="btn btn-error btn-outline btn-wide flex items-center gap-2 rounded-md"
                                >
                                    <X size={20} /> Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
