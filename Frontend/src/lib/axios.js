import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_NODE_ENV === "development"
      ? "http://localhost:5001"
      : import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});