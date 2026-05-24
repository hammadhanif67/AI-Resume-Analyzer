import { apiClient } from "./client";
import type { ApiResponse } from "../types/api";
import type { User } from "../types/auth";

export interface UpdateProfilePayload {
  name: string;
  profileImage?: File | null;
}

const PROFILE_UPDATE_ENDPOINTS = ["/api/profile", "/api/user/profile", "/api/users/profile"] as const;
let profileUpdateRouteAvailable: boolean | null = null;

function isNotFound(error: unknown) {
  return error instanceof Error && (error.message.includes("404") || error.message.toLowerCase().includes("not found"));
}

async function hasProfileUpdateRoute() {
  if (profileUpdateRouteAvailable !== null) {
    return profileUpdateRouteAvailable;
  }
  try {
    const response = await apiClient.get<{ paths?: Record<string, unknown> }>("/openapi.json");
    const paths = response.data.paths ?? {};
    profileUpdateRouteAvailable = PROFILE_UPDATE_ENDPOINTS.some((endpoint) => endpoint in paths);
    return profileUpdateRouteAvailable;
  } catch {
    profileUpdateRouteAvailable = true;
    return true;
  }
}

export const profileApi = {
  getProfile: async () => {
    const response = await apiClient.get<ApiResponse<User>>("/api/auth/me");
    return response.data.data;
  },
  updateProfile: async ({ name, profileImage }: UpdateProfilePayload) => {
    const routeAvailable = await hasProfileUpdateRoute();
    if (!routeAvailable) {
      throw new Error("Profile update API is not available on the running backend. Restart the backend server so the latest profile routes are loaded.");
    }
    const formData = new FormData();
    formData.append("name", name);
    if (profileImage) {
      formData.append("profile_image", profileImage);
    }
    for (const endpoint of PROFILE_UPDATE_ENDPOINTS) {
      try {
        const response = await apiClient.put<ApiResponse<User>>(endpoint, formData);
        return response.data.data;
      } catch (error) {
        if (!isNotFound(error)) {
          throw error;
        }
      }
      try {
        const response = await apiClient.patch<ApiResponse<User>>(endpoint, formData);
        return response.data.data;
      } catch (error) {
        if (!isNotFound(error)) {
          throw error;
        }
      }
    }
    throw new Error("Profile update route not found. Please verify backend profile update endpoint.");
  },
};
