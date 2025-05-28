import axios from "axios";
const url = import.meta.env.VITE_API_BASE_URL

export const axiosObj = axios.create({
    baseURL: url,
    withCredentials: true
})