import type { NavigateFunction } from "react-router-dom";

import { authApi } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export async function logoutAndRedirect(navigate: NavigateFunction, path = "/") {
  try {
    await authApi.logout();
  } catch {
    // Local logout should still complete if the server is unavailable.
  }
  useAuthStore.getState().logout();
  navigate(path);
}
