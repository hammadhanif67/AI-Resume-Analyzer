import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { useCurrentUser } from "../hooks/useCurrentUser";
import { useAuthStore } from "../store/authStore";
import { logoutAndRedirect } from "../utils/logout";
import { PublicIcon } from "./PublicIcon";

const publicLinks = [
  { to: "/", label: "Home" },
  { to: "/features", label: "Features" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function PublicNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  useCurrentUser();

  async function handleLogout() {
    setIsMenuOpen(false);
    await logoutAndRedirect(navigate, "/");
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="public-navbar">
      <div className="public-container flex h-[72px] items-center justify-between gap-4">
        <Link className="public-brand" onClick={closeMenu} to="/">
          <span className="public-brand-mark">AI</span>
          <span className="truncate text-[1.05rem] font-black leading-none text-ink">AI Resume Analyzer</span>
        </Link>

        <nav aria-label="Public navigation" className="hidden items-center gap-1 lg:flex">
          {publicLinks.map((link) => (
            <NavLink
              className={({ isActive }) => `public-nav-link ${isActive ? "active" : ""}`}
              end={link.to === "/"}
              key={link.to}
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2.5 sm:flex">
          {isAuthenticated ? (
            <>
              <Link className="public-nav-button secondary" to="/dashboard">Dashboard</Link>
              <button className="public-nav-button primary" onClick={handleLogout} type="button">Logout</button>
            </>
          ) : (
            <>
              <Link className="public-nav-button secondary" to="/login">Login</Link>
              <Link className="public-nav-button primary" to="/login">Get Started</Link>
            </>
          )}
        </div>

        <button
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="public-menu-button lg:hidden"
          onClick={() => setIsMenuOpen((value) => !value)}
          type="button"
        >
          <PublicIcon className="h-5 w-5" name={isMenuOpen ? "x" : "menu"} />
        </button>
      </div>

      <div className={`public-mobile-panel lg:hidden ${isMenuOpen ? "open" : ""}`}>
        <div className="public-container py-3">
          <nav aria-label="Mobile public navigation" className="grid gap-1">
            {publicLinks.map((link) => (
              <NavLink
                className={({ isActive }) => `public-mobile-link ${isActive ? "active" : ""}`}
                end={link.to === "/"}
                key={link.to}
                onClick={closeMenu}
                to={link.to}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-3 grid gap-2 border-t border-slate-200/75 pt-3 sm:hidden">
            {isAuthenticated ? (
              <>
                <Link className="public-nav-button secondary w-full" onClick={closeMenu} to="/dashboard">Dashboard</Link>
                <button className="public-nav-button primary w-full" onClick={handleLogout} type="button">Logout</button>
              </>
            ) : (
              <>
                <Link className="public-nav-button secondary w-full" onClick={closeMenu} to="/login">Login</Link>
                <Link className="public-nav-button primary w-full" onClick={closeMenu} to="/login">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
