import axios from "axios";
import * as SecureStore from "expo-secure-store";

// 10.0.2.2 is for Android Emulator
// 192.168.1.28 is your computer's local IP (based on your current Expo logs)
export const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.28:5000/api";

console.log("Using API_URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`Response: ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("Response Error Data:", error.response.data);
      console.error("Response Error Status:", error.response.status);
    } else {
      console.error("Response Error Message:", error.message || error);
    }
    
    if (error.response?.status === 401) {
      // Could handle logout here or refresh token
      console.warn("Unauthorized! User might need to log in again.");
    }
    return Promise.reject(error);
  }
);

export default api;
