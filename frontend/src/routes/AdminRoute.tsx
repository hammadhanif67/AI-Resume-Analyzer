import { Navigate, Outlet, useLocation } from "react-router-dom";

import { AccessDeniedPage } from "../pages/AccessDeniedPage";
import { LoadingState } from "../components/LoadingState";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useAuthStore } from "../store/authStore";

export function AdminRoute() {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const currentUserQuery = useCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user && currentUserQuery.isLoading) {
    return (
      <main className="min-h-screen bg-panel p-6">
        <LoadingState message="Checking admin access..." />
      </main>
    );
  }

  if (user && user.role !== "admin") {
    return <AccessDeniedPage />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
