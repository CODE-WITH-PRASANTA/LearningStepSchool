import axios from "axios";

export const IMAGE_URL = "http://localhost:5000";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  // withCredentials: true,
});

export default API;