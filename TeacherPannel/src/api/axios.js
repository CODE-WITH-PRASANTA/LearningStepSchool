import axios from "axios";

export const BASE_URL = "http://localhost:5000";
export const IMAGE_URL = BASE_URL;

// 🔥 MAIN API
const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});

// 🔥 REQUEST INTERCEPTOR (TOKEN)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 RESPONSE INTERCEPTOR (AUTO LOGOUT)
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;