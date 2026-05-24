import { apiClient } from "./client";
import type { ApiResponse } from "../types/api";
import { saveLocalContactMessage } from "../utils/contactMessageStorage";

export interface ContactMessageRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export const contactApi = {
  sendMessage: async (payload: ContactMessageRequest) => {
    try {
      const response = await apiClient.post<ApiResponse<ContactMessage>>("/api/contact/messages", payload);
      return response.data.message;
    } catch (error) {
      if (error instanceof Error && error.message.includes("404")) {
        saveLocalContactMessage(payload);
        return "Message saved locally for demo mode.";
      }
      throw error;
    }
  },
};
