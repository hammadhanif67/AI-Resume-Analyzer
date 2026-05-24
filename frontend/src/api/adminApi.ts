import { apiClient } from "./client";
import type { ApiResponse } from "../types/api";
import type { AdminContactMessage, AdminLog, AdminOverview, AdminReport, AdminReportDetail, AdminResume, AdminUser } from "../types/admin";
import { getLocalContactMessages, updateLocalContactMessageStatus } from "../utils/contactMessageStorage";

const adminMessageEndpoints = ["/api/admin/contact-messages", "/api/admin/messages"] as const;
let adminMessagesRouteAvailable: boolean | null = null;

function isMissingAdminMessagesRoute(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }
  const message = error.message.toLowerCase();
  return message.includes("404") || message.includes("not found") || message.includes("admin api route not found");
}

async function hasAdminMessagesRoute() {
  if (adminMessagesRouteAvailable !== null) {
    return adminMessagesRouteAvailable;
  }
  try {
    const response = await apiClient.get<{ paths?: Record<string, unknown> }>("/openapi.json");
    const paths = response.data.paths ?? {};
    adminMessagesRouteAvailable = adminMessageEndpoints.some((endpoint) => endpoint in paths);
    return adminMessagesRouteAvailable;
  } catch {
    adminMessagesRouteAvailable = true;
    return true;
  }
}

export const adminApi = {
  getAdminOverview: async () => {
    const response = await apiClient.get<ApiResponse<AdminOverview>>("/api/admin/overview");
    return response.data.data;
  },
  getAdminUsers: async () => {
    const response = await apiClient.get<ApiResponse<AdminUser[]>>("/api/admin/users");
    return response.data.data;
  },
  getAdminResumes: async () => {
    const response = await apiClient.get<ApiResponse<AdminResume[]>>("/api/admin/resumes");
    return response.data.data;
  },
  getAdminReports: async () => {
    const response = await apiClient.get<ApiResponse<AdminReport[]>>("/api/admin/reports");
    return response.data.data;
  },
  getAdminReport: async (reportId: number) => {
    const response = await apiClient.get<ApiResponse<AdminReportDetail>>(`/api/admin/reports/${reportId}`);
    return response.data.data;
  },
  getAdminLogs: async () => {
    const response = await apiClient.get<ApiResponse<AdminLog[]>>("/api/admin/logs");
    return response.data.data;
  },
  getContactMessages: async () => {
    if (!(await hasAdminMessagesRoute())) {
      return getLocalContactMessages();
    }
    for (const endpoint of adminMessageEndpoints) {
      try {
        const response = await apiClient.get<ApiResponse<AdminContactMessage[]>>(endpoint);
        return response.data.data;
      } catch (error) {
        if (!isMissingAdminMessagesRoute(error)) {
          throw error;
        }
      }
    }
    return getLocalContactMessages();
  },
  updateContactMessageStatus: async (messageId: number, status: string) => {
    if (!(await hasAdminMessagesRoute())) {
      return updateLocalContactMessageStatus(messageId, status);
    }
    for (const endpoint of adminMessageEndpoints) {
      try {
        const response = await apiClient.patch<ApiResponse<AdminContactMessage>>(`${endpoint}/${messageId}/status`, { status });
        return response.data.data;
      } catch (error) {
        if (!isMissingAdminMessagesRoute(error)) {
          throw error;
        }
      }
    }
    return updateLocalContactMessageStatus(messageId, status);
  },
};
