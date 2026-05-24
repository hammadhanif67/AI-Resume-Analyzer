import type { ContactMessage, ContactMessageRequest } from "../api/contactApi";

const STORAGE_KEY = "resume_analyzer_contact_messages";

function readMessages(): ContactMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as ContactMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeMessages(messages: ContactMessage[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

export function saveLocalContactMessage(payload: ContactMessageRequest): ContactMessage {
  const messages = readMessages();
  const nextId = messages.length ? Math.max(...messages.map((item) => item.id)) + 1 : 1;
  const message: ContactMessage = {
    id: nextId,
    name: payload.name,
    email: payload.email,
    subject: payload.subject,
    message: payload.message,
    status: "new",
    created_at: new Date().toISOString(),
  };
  writeMessages([message, ...messages]);
  return message;
}

export function getLocalContactMessages(): ContactMessage[] {
  return readMessages().sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
}

export function updateLocalContactMessageStatus(messageId: number, status: string): ContactMessage {
  const messages = readMessages();
  const index = messages.findIndex((item) => item.id === messageId);
  if (index === -1) {
    throw new Error("Contact message not found.");
  }
  const updated = { ...messages[index], status };
  messages[index] = updated;
  writeMessages(messages);
  return updated;
}
