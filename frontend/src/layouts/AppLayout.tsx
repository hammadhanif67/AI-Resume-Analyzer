import { Outlet } from "react-router-dom";

import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { useCurrentUser } from "../hooks/useCurrentUser";

export function AppLayout() {
  useCurrentUser();

  return (
    <div className="min-h-screen bg-[#f5f8fc]">
      <Navbar />
      <div className="pt-16 md:block">
        <Sidebar />
        <main className="min-w-0 overflow-x-hidden p-4 sm:p-6 md:ml-64 lg:p-6">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
