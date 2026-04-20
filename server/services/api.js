// client/src/services/api.js

import axios from "axios";
import { getToken } from "../utils/auth";

const api = axios.create({
    baseURL: "http://localhost:5000",
});

// interceptor
api.interceptors.request.use((config) => {
    const token = getToken();

    if (
        token &&
        !config.url.includes("/auth/signup") &&
        !config.url.includes("/auth/login")
    ) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;