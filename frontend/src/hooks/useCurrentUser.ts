import { useQuery } from "@tanstack/react-query";

import { authApi } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export function useCurrentUser() {
  const { isAuthenticated, setUser, user } = useAuthStore();

  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const currentUser = await authApi.me();
      setUser(currentUser);
      return currentUser;
    },
    enabled: isAuthenticated && !user,
  });
}
