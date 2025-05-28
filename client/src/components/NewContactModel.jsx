import { useState } from "react";
import { useChatStore } from "../store";
import SearchDropdown from "./ui/SearchDropDown";
import { X } from "lucide-react";
import { DEFAULT_IMG } from "../contants";
function NewContactModel() {
    const addContact = useChatStore((state) => state.addContact);
    const [selectedUser, setSelectedUser] = useState([]);

    const handleSaveUsers = () => {
        if (selectedUser.length === 0) return;
        for (let user of selectedUser) {
            addContact(user._id);
        }
        setSelectedUser([]);
    };

    const removeSelectedUser = (id) => {
        setSelectedUser((p) => p.filter((u) => u._id !== id));
    };

    return (
        <dialog id="new_contact" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box overflow-y-visible w-full sm:w-1/2 px-10 pt-15 transition-all duration-300 bg-base-200/70 backdrop-blur-lg">
                <h3 className=" text-lg font-semibold absolute top-5"> New Contact</h3>

                {/* seach contact using email id */}
                <SearchDropdown setSelectUser={setSelectedUser} />

                {/* close X button */}
                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            onClick={() => setSelectedUser([])}
                        >
                            <X size={15} />
                        </button>
                    </form>
                </div>

                {/* selected users */}
                {selectedUser && (
                    <div className="space-x-5">
                        {selectedUser.map((user) => (
                            <div key={user._id} className="avatar indicator mb-8">
                                {/* username */}
                                <span className="indicator-item indicator-bottom indicator-center badge text-xs/snug hover:cursor-default">
                                    {user.username.slice(0, 6)}
                                </span>

                                {/* remove X button */}
                                <span
                                    className="indicator-item indicator-top indicator-end badge rounded-full hover:cursor-pointer"
                                    onClick={() => removeSelectedUser(user._id)}
                                >
                                    <X className="size-3" />
                                </span>

                                {/* profile picture */}
                                <div className="w-14 rounded-full">
                                    <img
                                        alt={user.username}
                                        title={user.username}
                                        className="w-full rounded-full object-cover"
                                        src={user.profilePicture || DEFAULT_IMG}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* buttons cancel and add contact */}
                <div className="modal-action flex justify-end gap-2">
                    {/* cancel button show if any user is selected */}
                    {selectedUser.length > 0 && (
                        <button
                            className={`btn btn-soft btn-error`}
                            onClick={() => setSelectedUser([])}
                        >
                            Cancel
                        </button>
                    )}

                    {/* add contact button */}
                    <button
                        className={`btn btn-soft btn-success  ${!selectedUser && "btn-disabled"}`}
                        onClick={handleSaveUsers}
                    >
                        Add contact
                    </button>
                </div>
            </div>
        </dialog>
    );
}

export default NewContactModel;
