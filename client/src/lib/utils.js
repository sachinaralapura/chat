
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

