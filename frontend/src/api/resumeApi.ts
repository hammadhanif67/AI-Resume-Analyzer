import { apiClient } from "./client";
import type { ApiResponse } from "../types/api";
import type { Resume } from "../types/resume";

export const resumeApi = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<ApiResponse<Resume>>("/api/resume/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  },
};
