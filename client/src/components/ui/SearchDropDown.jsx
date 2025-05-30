import { useState, useEffect, useRef } from "react";
import useDebounce from "../../lib/useDebounce";
import { useChatStore } from "../../store";
import toast from "react-hot-toast";
import { DEFAULT_IMG, MAX_USER_SELECTION } from "../../contants/index";
import { Check } from "lucide-react";

const SearchDropdown = ({ setSelectUser }) => {
    const loading = useChatStore((state) => state.isSearchingContact);
    const UsersSearch = useChatStore((state) => state.UsersSearch);
    const searchUsers = useChatStore((state) => state.searchUsers);
    const contacts = useChatStore((state) => state.contacts);

    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to control dropdown visibility

    const debouncedSearchTerm = useDebounce(searchTerm, 800); // Debounce for 500ms
    const dropdownRef = useRef(null); // Ref for the dropdown container

    // Effect to handle clicking outside the dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target))
                setIsDropdownOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Effect to fetch search results when the debounced search term changes
    useEffect(() => {
        if (debouncedSearchTerm) {
            UsersSearch(debouncedSearchTerm);
        }
    }, [debouncedSearchTerm]); // Re-run when debouncedSearchTerm changes

    // Function to handle input change
    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value.trim().length > 0) {
            setIsDropdownOpen(true); // Open dropdown as soon as user starts typing
        } else {
            setIsDropdownOpen(false); // Close if input is cleared
        }
    };

    // Function to handle add contact
    const handleSelectUser = (user) => {
        setIsDropdownOpen(false); // Close dropdown after selection
        // check if user is already selected
        setSelectUser((p) => {
            if (p.find((u) => u._id === user._id)) return p;
            if (contacts.find((u) => u._id === user._id)) return p;
            if (p.length >= MAX_USER_SELECTION) {
                toast.error(`You can't add more than ${MAX_USER_SELECTION} contacts`);
                return p;
            }
            return [...p, user];
        });
    };

    return (
        <div
            className="dropdown dropdown-top relative inline-block w-full max-w-md mb-10 "
            ref={dropdownRef}
        >
            <label className="label w-full mt-2">
                <input
                    type="email"
                    placeholder="search users by email..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => {
                        // Open dropdown on focus if there's a search term or results available
                        if (searchTerm.trim() || searchUsers.length > 0 || loading) {
                            setIsDropdownOpen(true);
                        }
                    }}
                    className="input input-ghost w-full border-primary/30 bg-base-300/80 backdrop-blur-lg"
                />
            </label>
            {/* The dropdown-content for the results */}
            {isDropdownOpen &&
                (debouncedSearchTerm.trim() || searchUsers.length > 0 || loading || error) && (
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-box  w-full p-2  max-h-100 overflow-y-auto absolute top-full right-10"
                    >
                        {loading && (
                            <li className="text-center py-2">
                                <span className="loading size-5 loading-ring"></span>
                            </li>
                        )}

                        {error && !loading && (
                            <li className="text-error text-center py-2">{error}</li>
                        )}

                        {/* Display no results message */}
                        {!loading &&
                            !error &&
                            searchUsers.length === 0 &&
                            debouncedSearchTerm.trim() && (
                                <li className="text-center py-2 text-base-content/60">
                                    No users found for "{searchTerm}"
                                </li>
                            )}

                        {/* Display search results */}
                        {!loading &&
                            !error &&
                            searchUsers.length > 0 &&
                            searchUsers.map((user) => (
                                <li key={user._id} onClick={() => handleSelectUser(user)}>
                                    <div className="flex flex-none items-center gap-2">
                                        {/* user profile picture */}
                                        <img
                                            src={user.profilePicture || DEFAULT_IMG}
                                            alt={"user profile picture"}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />

                                        {/* user name and email */}
                                        <div className="flex flex-1">
                                            <div className="font-semibold">{user.username}</div>
                                            <div className="text-sm text-base-content/70">
                                                {user.email}
                                            </div>
                                        </div>

                                        {/* check if user is already in contact */}
                                        {contacts.find((c) => c._id === user._id) && (
                                            <Check className="text-primary size-5" />
                                        )}
                                    </div>
                                </li>
                            ))}
                    </ul>
                )}
        </div>
    );
};

export default SearchDropdown;
