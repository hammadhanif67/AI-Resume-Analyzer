import { Outlet } from "react-router-dom";

import { AdminHeader } from "../components/AdminHeader";
import { AdminSidebar } from "../components/AdminSidebar";

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#f5f8fc]">
      <AdminHeader />
      <div className="pt-16 md:block">
        <AdminSidebar />
        <main className="min-w-0 overflow-x-hidden p-4 sm:p-6 md:ml-64 lg:p-6">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
