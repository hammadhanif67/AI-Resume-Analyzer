import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { PublicIcon, type PublicIconName } from "./PublicIcon";
import { UserAvatar } from "./UserAvatar";
import { useAuthStore } from "../store/authStore";
import type { User } from "../types/auth";
import { logoutAndRedirect } from "../utils/logout";

const userLinks = [
  { to: "/", label: "Home", icon: "globe" as PublicIconName },
  { to: "/dashboard", label: "Dashboard", icon: "barChart" as PublicIconName },
  { to: "/upload", label: "Upload Resume", icon: "upload" as PublicIconName },
  { to: "/reports", label: "Reports", icon: "fileText" as PublicIconName },
  { to: "/profile", label: "Profile", icon: "users" as PublicIconName },
];

export function Sidebar() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const links = user?.role === "admin" ? [...userLinks, { to: "/admin", label: "Admin Dashboard", icon: "shield" as PublicIconName }] : userLinks;
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
      isActive ? "bg-[#17345f] text-white shadow-sm" : "text-slate-300 hover:bg-white/8 hover:text-white"
    }`;

  async function handleLogout() {
    setIsOpen(false);
    await logoutAndRedirect(navigate, "/");
  }

  return (
    <aside className="shrink-0 border-b border-slate-900 bg-[#07152b] text-white md:fixed md:bottom-0 md:left-0 md:top-16 md:z-30 md:h-[calc(100vh-4rem)] md:w-64 md:overflow-y-auto md:border-b-0 md:border-r md:border-slate-900">
      <div className="flex items-center justify-between gap-3 p-3 md:hidden">
        <p className="text-sm font-bold text-white">Workspace menu</p>
        <button className="rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm font-bold text-white shadow-sm" onClick={() => setIsOpen(true)} type="button">
          Menu
        </button>
      </div>
      {isOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button aria-label="Close menu" className="absolute inset-0 bg-slate-950/45" onClick={() => setIsOpen(false)} type="button" />
          <div className="absolute left-0 top-0 flex h-full w-[min(21rem,86vw)] flex-col bg-[#07152b] p-4 text-white shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-bold uppercase text-slate-300">Workspace</p>
              <button className="rounded-md border border-white/10 px-3 py-1.5 text-sm font-bold text-white" onClick={() => setIsOpen(false)} type="button">
                Close
              </button>
            </div>
            <SidebarProfile user={user} />
            <nav className="mt-4 flex min-w-0 flex-1 flex-col gap-2" aria-label="Mobile main navigation">
              {links.map((link) => (
                <NavLink className={navLinkClass} end={link.to === "/"} key={link.to} onClick={() => setIsOpen(false)} to={link.to}>
                  <PublicIcon className="h-4 w-4 shrink-0" name={link.icon} />
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="border-t border-white/10 pt-3">
              <button className="app-sidebar-logout justify-start" onClick={handleLogout} type="button">Logout</button>
            </div>
          </div>
        </div>
      ) : null}
      <nav className="hidden min-h-full min-w-0 gap-2 p-4 md:flex md:flex-col" aria-label="Main navigation">
        <div className="hidden min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-white/7 p-3 md:flex">
          <UserAvatar user={user} size="md" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">{user?.name ?? "User"}</p>
            <p className="truncate text-xs text-slate-400">{user?.email ?? ""}</p>
          </div>
        </div>
        {links.map((link) => (
          <NavLink end={link.to === "/"} key={link.to} to={link.to} className={navLinkClass}>
            <PublicIcon className="h-4 w-4 shrink-0" name={link.icon} />
            {link.label}
          </NavLink>
        ))}
        <div className="mt-auto border-t border-white/10 pt-3">
          <button className="app-sidebar-logout justify-start" onClick={handleLogout} type="button">Logout</button>
        </div>
      </nav>
    </aside>
  );
}

function SidebarProfile({ user }: { user: User | null }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-white/7 p-3">
      <UserAvatar user={user} size="md" />
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-white">{user?.name ?? "User"}</p>
        <p className="truncate text-xs text-slate-400">{user?.email ?? ""}</p>
      </div>
    </div>
  );
}
