import { Image, Send, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useChatStore } from "../store";

function MessageInput() {
    const sendMessage = useChatStore((state) => state.sendMessage);
    const isSendingMessage = useChatStore((state) => state.isSendingMessage);

    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const imageInputRef = useRef(null);

    const handleImageSelect = (e) => {
        const file = imageInputRef.current.files[0];
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;
        let message = {};
        if (text) message.text = text;
        if (imagePreview) message.image = imagePreview;
        try {
            await sendMessage(message);
            // clear input
            setText("");
            setImagePreview(null);
            if (imageInputRef.current) imageInputRef.current.value = "";
        } catch (err) {
            console.error(err);
            toast.error(err.response.data.message);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        if (imageInputRef.current) imageInputRef.current.value = "";
    };

    return (
        <div className="p-4 w-full flex-none absolute bottom-0 bg-base-200/70 backdrop-blur-2xl">
            {/* image preview */}
            {imagePreview && (
                <div className="relative w-fit my-2 indicator bg-white">
                    <img
                        src={imagePreview || "/owl.svg"}
                        alt="img"
                        className="w-48 h-48 object-cover"
                    />
                    <button className="absolute top-0 right-0" onClick={removeImage}>
                        <X className="size-5" />
                    </button>
                </div>
            )}

            <div className="flex items-center gap-4">
                {/* message input */}
                <input
                    type="text"
                    placeholder="Type a message"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className={`flex-1 input input-ghost border-primary/30 w-full h-10 bg-base-100`}
                />


                {/* send button and image button */}
                <div className="flex-none flex gap-2  text-primary hover:text-base-content">
                    {/* image button */}
                    <button
                        className={`btn btn-primary btn-soft ${imagePreview ? "hidden" : ""}`}
                        onClick={() => imageInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                            ref={imageInputRef}
                        />
                        <Image className={`size-5 ${imagePreview ? "hidden" : ""} `} />
                    </button>

                    {/*{/* send button */}
                    <button
                        className="btn btn-primary btn-soft rounded-md"
                        onClick={handleSendMessage}
                        disabled={(!text.trim() && !imagePreview) || isSendingMessage}
                    >
                        <Send className="size-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MessageInput;
