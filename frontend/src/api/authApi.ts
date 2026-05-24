import { apiClient } from "./client";
import type { ApiResponse } from "../types/api";
import type { AuthPayload, ForgotPasswordRequest, LoginRequest, RegisterRequest, ResetPasswordRequest, User } from "../types/auth";

export const authApi = {
  register: async (payload: RegisterRequest) => {
    const response = await apiClient.post<ApiResponse<AuthPayload>>("/api/auth/register", payload);
    return response.data.data;
  },
  login: async (payload: LoginRequest) => {
    const response = await apiClient.post<ApiResponse<AuthPayload>>("/api/auth/login", payload);
    return response.data.data;
  },
  me: async () => {
    const response = await apiClient.get<ApiResponse<User>>("/api/auth/me");
    return response.data.data;
  },
  logout: async () => {
    const response = await apiClient.post<ApiResponse<Record<string, never>>>("/api/auth/logout");
    return response.data.message;
  },
  forgotPassword: async (payload: ForgotPasswordRequest) => {
    const response = await apiClient.post<ApiResponse<Record<string, never>>>("/api/auth/forgot-password", payload);
    return response.data.message;
  },
  resetPassword: async (payload: ResetPasswordRequest) => {
    const response = await apiClient.post<ApiResponse<Record<string, never>>>("/api/auth/reset-password", payload);
    return response.data.message;
  },
};
