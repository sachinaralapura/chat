import { useState } from "react";
import { useChatStore } from "../../store";
import SearchDropdown from "../ui/SearchDropDown";
import { X } from "lucide-react";
import { DEFAULT_IMG } from "../../contants";
import Modal from "./Modal"
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
        <Modal id={"new-contact"}>
            <h3 className=" text-lg font-semibold absolute top-6"> New Contact</h3>
            {/* seach contact using email id */}
            <SearchDropdown setSelectUser={setSelectedUser} />

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
        </Modal>
    );
}

export default NewContactModel;
