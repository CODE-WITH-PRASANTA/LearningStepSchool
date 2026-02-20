import axios from "axios";

export const BASE_URL = "http://localhost:5000";

// 🔥 REMOVE trailing slash
export const IMAGE_URL = BASE_URL;

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});

export default API;