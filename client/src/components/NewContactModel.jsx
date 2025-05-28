import { useState, useEffect } from "react";
import { useChatStore } from "../store";
import useDebounce from "../lib/useDebounce";
import SearchDropdown from "./ui/SearchDropDown";
function NewContactModel() {
    const UsersSearch = useChatStore((state) => state.UsersSearch);
    const searchUsers = useChatStore((state) => state.searchUsers);
    const addContact = useChatStore((state) => state.addContact);
    const getContacts = useChatStore((state) => state.getContacts);
    const [selectedUser, setSelectedUser] = useState([]);

    const [input, setInput] = useState("");
    const debouncedValue = useDebounce(input, 1000);

    useEffect(() => {
        if (debouncedValue === "") return;
        UsersSearch(debouncedValue);
        console.log(searchUsers);
    }, [debouncedValue]);

    const handleSaveUsers = () => {
        if (selectedUser.length === 0) return;
        for (let user of selectedUser) {
            addContact(user._id);
        }
        getContacts();
        setSelectedUser([]);
    };

    return (
        <dialog id="new_contact" className="modal modal-bottom sm:modal-middle ">
            <div className="modal-box w-full sm:w-1/2 px-10 pt-15 transition-all duration-300 bg-base-300/80  backdrop-blur-lg overflow-y-visible">
                <h3 className=" text-lg font-semibold absolute top-5"> New Contact</h3>
                {/* seach contact using email id */}
                <SearchDropdown setSelectUser={setSelectedUser} />
                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            onClick={() => setSelectedUser([])}
                        >
                            ✕
                        </button>
                    </form>
                </div>
                {selectedUser && (
                    <div className="space-x-6">
                        {selectedUser.map((user) => (
                            <div key={user._id} className="avatar indicator">
                                <span className="indicator-item indicator-bottom indicator-center badge text-xs/snug">
                                    {user.username.slice(0, 6)}
                                </span>
                                <div className="w-14 rounded-full">
                                    <img
                                        alt={user.username}
                                        title={user.username}
                                        src={user.profilePicture || "/owl.png"}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="modal-action flex justify-end gap-2">
                    {selectedUser.length > 0 && (
                        <button
                            className={`btn btn-soft btn-error`}
                            onClick={() => setSelectedUser([])}
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        className={`btn btn-soft btn-success  ${!selectedUser && "btn-disabled"}`}
                        onClick={handleSaveUsers}
                    >
                        Save contact
                    </button>
                </div>
            </div>
        </dialog>
    );
}

export default NewContactModel;
