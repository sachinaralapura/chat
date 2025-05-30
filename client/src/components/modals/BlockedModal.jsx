import { useMemo } from 'react';
import { useChatStore, useUserStore } from '../../store'
import Modal from './Modal'
import { DEFAULT_IMG } from '../../contants';


function BlockedModal() {
    const contacts = useChatStore((state) => state.contacts);
    const blockContact = useUserStore((state) => state.blockContact);
    const getContacts = useChatStore((state) => state.getContacts);
    const blocked = useMemo(() => {
        return contacts.filter((user) => user.blocked === true);
    }, [contacts]);

    const handleBlock = async (id, block, username) => {
        await blockContact(id, block, username);
        getContacts();
    }

    return (
        <Modal id={"blocked-modal"}>
            <h3 className="text-lg font-semibold absolute top-6">Blocked Users</h3>
            <div className="space-y-3 mt-5">
                {blocked.map((user) => (
                    <div key={user._id} className="flex items-center space-x-3">
                        <img className="flex-none size-12 rounded-full" src={user.profilePicture || DEFAULT_IMG} alt={user.username} />
                        <span className="text-lg font-semibold flex-1 ml-5 text-left">{user.username}</span>
                        <button className='btn btn-circle btn-ghost flex-none' onClick={() => handleBlock(user._id, false, user.username)} >unblock</button>
                    </div>
                ))}
            </div>
        </Modal>
    )
}

export default BlockedModal