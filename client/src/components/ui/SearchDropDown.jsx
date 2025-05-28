import { useState, useEffect, useRef } from "react";
import useDebounce from "../../lib/useDebounce";
import { useChatStore } from "../../store";

const SearchDropdown = ({ setSelectUser }) => {
    const loading = useChatStore((state) => state.isSearchingContact);
    const UsersSearch = useChatStore((state) => state.UsersSearch);
    const searchUsers = useChatStore((state) => state.searchUsers);

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

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value.trim().length > 0) {
            setIsDropdownOpen(true); // Open dropdown as soon as user starts typing
        } else {
            setIsDropdownOpen(false); // Close if input is cleared
        }
    };

    const handleSelectUser = (user) => {
        setIsDropdownOpen(false); // Close dropdown after selection
        // check if user is already selected
        setSelectUser((p) => {
            if (p.find((u) => u._id === user._id)) return p;
            return [...p, user];
        });
    };

    return (
        <div
            className="dropdown dropdown-top relative inline-block w-full max-w-md "
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

                        {!loading &&
                            !error &&
                            searchUsers.length === 0 &&
                            debouncedSearchTerm.trim() && (
                                <li className="text-center py-2 text-base-content/60">
                                    No users found for "{searchTerm}"
                                </li>
                            )}

                        {!loading &&
                            !error &&
                            searchUsers.length > 0 &&
                            searchUsers.map((user) => (
                                <li key={user._id} onClick={() => handleSelectUser(user)}>
                                    <a>
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={user.profilePicture || "/owl.png"}
                                                alt={user.username}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <div>
                                                <div className="font-semibold">{user.username}</div>
                                                <div className="text-sm text-base-content/70">
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            ))}
                    </ul>
                )}
        </div>
    );
};

export default SearchDropdown;
