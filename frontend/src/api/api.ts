import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers.set("Content-Type", "application/json");
  return config;
});

export default api;
