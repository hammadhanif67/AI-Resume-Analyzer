import { create } from "zustand";

import type { User } from "../types/auth";
import { tokenStorage } from "../utils/storage";

const USER_STORAGE_KEY = "resume_analyzer_user";

function loadStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function persistUser(user: User | null) {
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return;
  }
  localStorage.removeItem(USER_STORAGE_KEY);
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const initialToken = tokenStorage.get();
const initialUser = loadStoredUser();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  token: initialToken,
  isAuthenticated: Boolean(initialToken || initialUser),
  login: (token, user) => {
    tokenStorage.set(token);
    persistUser(user);
    set({ token, user, isAuthenticated: true });
  },
  logout: () => {
    tokenStorage.clear();
    persistUser(null);
    set({ token: null, user: null, isAuthenticated: false });
  },
  setUser: (user) => {
    persistUser(user);
    set({ user, isAuthenticated: Boolean(user ?? tokenStorage.get()) });
  },
}));
