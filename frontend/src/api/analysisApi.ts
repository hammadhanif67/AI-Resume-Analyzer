import { apiClient } from "./client";
import type { ApiResponse } from "../types/api";
import type { AnalysisResult, JobMatchRequest, JobMatchResult } from "../types/analysis";

export const analysisApi = {
  analyzeResume: async (resumeId: number) => {
    const response = await apiClient.post<ApiResponse<AnalysisResult>>(`/api/analysis/resume/${resumeId}`);
    return response.data.data;
  },
  jobMatch: async (payload: JobMatchRequest) => {
    const response = await apiClient.post<ApiResponse<JobMatchResult>>("/api/analysis/job-match", payload);
    return response.data.data;
  },
};
