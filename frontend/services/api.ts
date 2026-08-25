import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      const pathname = window.location.pathname;
      const isAuthPage = 
        pathname === '/welcome' || 
        pathname === '/login' || 
        pathname === '/register' ||
        pathname === '/get-started';

      if (!isAuthPage) {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        window.location.href = '/welcome';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
