import axios, { AxiosInstance } from "axios"

const pistonBaseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"

const instance: AxiosInstance = axios.create({
    baseURL: pistonBaseUrl + "/api",
    headers: {
        "Content-Type": "application/json",
    },
})

export default instance
