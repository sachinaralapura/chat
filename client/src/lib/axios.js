import axios from "axios";

const url = import.meta.env.MODE === "development" ? import.meta.env.VITE_API_BASE_URL : "/api/v1";

export const axiosObj = axios.create({
    baseURL: url,
    withCredentials: true
})