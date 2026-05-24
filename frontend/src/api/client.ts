import axios, { AxiosError } from "axios";

import { useAuthStore } from "../store/authStore";
import { tokenStorage } from "../utils/storage";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    const requestUrl = error.config?.url ?? "";
    const message =
      error.response?.status === 404 && requestUrl.startsWith("/api/admin/reports/")
        ? error.response?.data?.message ?? "Report not found or you do not have access to this report."
        : error.response?.status === 404 && requestUrl.startsWith("/api/admin")
        ? "Admin API route not found. Please verify backend admin routes."
        : error.response?.status === 404 && requestUrl.startsWith("/api/report")
          ? "Report not found or you do not have access to this report."
        : error.response?.data?.message ?? error.message ?? "Request failed";
    return Promise.reject(new Error(message));
  },
);
