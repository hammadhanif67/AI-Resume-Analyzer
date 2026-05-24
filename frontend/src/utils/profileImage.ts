import { API_BASE_URL } from "../api/client";
import type { User } from "../types/auth";

export function getProfileImageUrl(user: Pick<User, "profile_image" | "profile_image_url"> | null | undefined) {
  const image = user?.profile_image_url || user?.profile_image;
  if (!image) {
    return "";
  }
  if (image.startsWith("http") || image.startsWith("blob:") || image.startsWith("data:")) {
    return image;
  }
  const normalizedImage = image.startsWith("/") ? image : `/${image}`;
  return `${API_BASE_URL}${normalizedImage}`;
}

export function getInitials(value: string | null | undefined) {
  const parts = (value || "User").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) {
    return "U";
  }
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}
