import toast from "react-hot-toast";
export const FormatDate = (date) => {
    return new Date(date).toLocaleString("en-in", {
        day: "numeric",
        month: "short",
        year: "2-digit",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    })
}

export const ErrorToast = (err) => {
    if (err.code === "ERR_NETWORK")
        toast.error(err.message);
    else
        toast.error(err.response.data.message);
}