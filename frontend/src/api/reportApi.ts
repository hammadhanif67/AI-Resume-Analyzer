import { apiClient } from "./client";
import type { ApiResponse } from "../types/api";
import type { ReportDetail, ReportSummary } from "../types/report";

export const reportApi = {
  history: async () => {
    const response = await apiClient.get<ApiResponse<ReportSummary[]>>("/api/report/history");
    return response.data.data;
  },
  detail: async (reportId: number) => {
    const response = await apiClient.get<ApiResponse<ReportDetail>>(`/api/report/${reportId}`);
    return response.data.data;
  },
  download: async (reportId: number) => {
    const response = await apiClient.get<Blob>(`/api/report/${reportId}/download`, { responseType: "blob" });
    return response.data;
  },
};
