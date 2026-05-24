import { Outlet } from "react-router-dom";

import { PublicFooter } from "../components/PublicFooter";
import { PublicNavbar } from "../components/PublicNavbar";

export function PublicLayout() {
  return (
    <div className="landing-shell premium-gradient min-h-screen text-white">
      <PublicNavbar />
      <Outlet />
      <PublicFooter />
    </div>
  );
}
