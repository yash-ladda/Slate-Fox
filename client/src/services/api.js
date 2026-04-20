import axios from "axios";
import { getToken } from "../utils/auth.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 

api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token && token !== "undefined" && token !== "") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized - Token may be invalid");
    }

    return Promise.reject(error);
  }
);

export default api;