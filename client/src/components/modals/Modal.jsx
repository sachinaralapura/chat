import { X } from "lucide-react"


function Modal({ id, children }) {
    return (
        <dialog id={id} className="modal modal-bottom sm:modal-middle">
            <div className="modal-box overflow-y-visible w-full  sm:w-1/2  px-10 pt-15 transition-all duration-300 bg-base-200/70 backdrop-blur-lg">
                {children}
                {/* close X button */}
                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        >
                            <X size={15} />
                        </button>
                    </form>
                </div>
            </div>

            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
}

export default Modal