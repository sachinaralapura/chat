import { useEffect } from 'react';
import { useAuthStore, useUserStore, useChatStore } from '../../store'
import Modal from './Modal'
import { DEFAULT_IMG } from '../../contants';
function RequestsModal() {
    const requests = useUserStore((state) => state.requests);
    const isFetchingRequests = useUserStore((state) => state.isFetchingRequests);
    const getRequests = useUserStore((state) => state.getRequests);
    const authUser = useAuthStore((state) => state.authUser);
    const addContact = useChatStore((state) => state.addContact);

    useEffect(() => {
        if (authUser?.requests?.length === 0) return;
        getRequests();
    }, [getRequests])

    const handleAccept = (id) => {
        addContact(id);
        getRequests();
    }

    if (isFetchingRequests) return <Modal id={"requests-modal"}><span className="loading loading-ring loading-xl"></span></Modal>

    return (
        <Modal id={"requests-modal"}>
            <h1 className="text-2xl font-semibold absolute top-6" >Requests</h1>
            <div className='mt-5 flex flex-col'>
                {

                    requests?.length > 0 ? requests?.map((request) => {
                        return (
                            <div className="flex items-center gap-2 my-2" key={request._id}>
                                <img className="flex-none size-12 rounded-full" src={request.profilePicture || DEFAULT_IMG} alt={request.username} />
                                <span className="text-lg font-semibold flex-1 ml-5 text-left">{request.username}

                                    <br />
                                    <span className="text-xs text-base-content/50">{request.email}</span>
                                </span>
                                <button className="btn btn-success btn-sm btn-soft" onClick={() => handleAccept(request._id)}>Accept</button>
                                <button className="btn btn-error btn-sm btn-soft" onClick={() => { }}>Reject</button>
                            </div>
                        )
                    }) : <p className="text-sm text-base-content/50">No requests</p>
                }
            </div>
        </Modal>
    )
}

export default RequestsModal