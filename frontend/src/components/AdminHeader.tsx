import { Link } from "react-router-dom";

import { UserAvatar } from "./UserAvatar";
import { useAuthStore } from "../store/authStore";

export function AdminHeader() {
  const { user } = useAuthStore();

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-200/80 bg-white shadow-sm">
      <div className="flex min-h-16 min-w-0 items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/admin" className="flex min-w-0 items-center gap-2 font-bold text-ink">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-ink text-xs text-white">AI</span>
          <span className="truncate">Resume Analyzer</span>
        </Link>
        <div className="flex min-w-0 shrink-0 items-center gap-2 text-sm sm:gap-3">
          <Link className="app-top-link shrink-0" to="/dashboard">User app</Link>
          <UserAvatar user={user} size="sm" />
          <span className="hidden max-w-48 truncate text-muted sm:inline">{user?.name ?? user?.email ?? "Admin User"}</span>
        </div>
      </div>
    </header>
  );
}
