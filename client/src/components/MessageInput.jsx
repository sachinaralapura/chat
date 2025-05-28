import { Image, Send, Upload, X } from "lucide-react";
import { useRef, useState } from "react";

function MessageInput() {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const imageInputRef = useRef(null);

    const handleImageSelect = (e) => {};

    const removeImage = () => {};

    const handleSendMessage = async () => {};

    return (
        <div className="p-4 w-full ">
            {true && (
                <div className="relative">
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
                <div className="flex flex-1 gap-2">
                    <input
                        type="text"
                        placeholder="Type a message"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="input input-ghost border-primary/30 w-full"
                    />
                </div>
                <div className="flex-none flex gap-2">
                    <button
                        className="btn btn-primary btn-soft label text-primary hover:text-base-content "
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

                    <button
                        className="btn btn-primary btn-soft rounded-md"
                        onClick={handleSendMessage}
                    >
                        <Send className="size-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MessageInput;
