import { Link } from "react-router-dom";

import { useAuthStore } from "../store/authStore";
import { PublicIcon } from "./PublicIcon";

const footerGroups = [
  {
    title: "Product",
    links: [
      { to: "/features", label: "Features" },
      { to: "/how-it-works", label: "How It Works" },
      { to: "/login", label: "Get Started" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
      { to: "/login", label: "Dashboard" },
    ],
  },
  {
    title: "Resources",
    links: [
      { to: "/features", label: "ATS scoring" },
      { to: "/how-it-works", label: "Resume workflow" },
      { to: "/contact", label: "Support" },
    ],
  },
];

const socials = [
  { to: "/contact", label: "LinkedIn", icon: "linkedin" as const },
  { to: "/contact", label: "GitHub", icon: "github" as const },
  { to: "/contact", label: "X", icon: "x" as const },
];

export function PublicFooter() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const productLinks = footerGroups.map((group) => (
    {
      ...group,
      links: group.links.map((link) => {
        if (link.label === "Get Started") {
          return { ...link, to: isAuthenticated ? "/dashboard" : "/login" };
        }
        if (link.label === "Dashboard") {
          return { ...link, to: isAuthenticated ? "/dashboard" : "/login" };
        }
        return link;
      }),
    }
  ));

  return (
    <footer className="public-footer">
      <div className="public-container">
        <div className="public-footer-cta">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-normal text-accent-100">Resume intelligence</p>
            <h2 className="mt-2 text-2xl font-black leading-tight text-white sm:text-3xl">Get practical resume signals in minutes.</h2>
          </div>
          <form className="public-footer-newsletter">
            <PublicIcon className="h-4 w-4 shrink-0 text-slate-400" name="mail" />
            <input aria-label="Email address" placeholder="Email address" type="email" />
            <button type="button">Subscribe</button>
          </form>
        </div>

        <div className="public-footer-main">
          <div className="min-w-0">
            <Link className="public-footer-brand" to="/">
              <span className="public-footer-brand-mark">AI</span>
              <span>AI Resume Analyzer</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm font-medium leading-6 text-slate-300">Premium resume analysis for ATS scoring, skill signals, job matching, and downloadable reports.</p>
            <div className="mt-5 flex items-center gap-2">
              {socials.map((item) => (
                <Link aria-label={item.label} className="public-social-link" key={item.label} to={item.to}>
                  <SocialIcon name={item.icon} />
                </Link>
              ))}
            </div>
          </div>

          <div className="public-footer-links">
            {productLinks.map((group) => (
              <nav aria-label={group.title} className="min-w-0" key={group.title}>
                <h3>{group.title}</h3>
                <div>
                  {group.links.map((link) => (
                    <Link key={`${group.title}-${link.label}`} to={link.to}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </nav>
            ))}
          </div>
        </div>

        <div className="public-footer-bottom">
          <p>{"\u00a9"} 2026 AI Resume Analyzer. All rights reserved.</p>
          <p>Clear resume signals. Better application decisions.</p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ name }: { name: "github" | "linkedin" | "x" }) {
  const paths = {
    github: (
      <>
        <path d="M12 2.25a9.75 9.75 0 0 0-3.08 19c.49.09.67-.21.67-.47v-1.68c-2.73.59-3.31-1.17-3.31-1.17-.44-1.13-1.09-1.43-1.09-1.43-.89-.61.07-.6.07-.6.98.07 1.5 1.01 1.5 1.01.88 1.5 2.3 1.07 2.86.82.09-.64.34-1.07.62-1.31-2.18-.25-4.47-1.09-4.47-4.85 0-1.07.38-1.95 1.01-2.64-.1-.25-.44-1.25.1-2.6 0 0 .83-.26 2.69 1.01A9.28 9.28 0 0 1 12 6.01c.83 0 1.66.11 2.43.33 1.86-1.27 2.68-1.01 2.68-1.01.55 1.35.21 2.35.11 2.6.63.69 1.01 1.57 1.01 2.64 0 3.77-2.3 4.59-4.49 4.84.35.3.67.9.67 1.82v2.7c0 .26.18.57.68.47A9.75 9.75 0 0 0 12 2.25Z" />
      </>
    ),
    linkedin: (
      <>
        <path d="M6.94 8.94H4.21v8.85h2.73V8.94Z" />
        <path d="M5.57 7.72a1.58 1.58 0 1 0 0-3.16 1.58 1.58 0 0 0 0 3.16Z" />
        <path d="M9.02 8.94h2.62v1.21h.04c.36-.69 1.26-1.42 2.59-1.42 2.77 0 3.28 1.82 3.28 4.19v4.87h-2.73v-4.31c0-1.03-.02-2.35-1.43-2.35-1.43 0-1.65 1.12-1.65 2.28v4.38H9.02V8.94Z" />
      </>
    ),
    x: (
      <>
        <path d="M4.25 4.75h3.18l4.17 5.55 4.77-5.55h2.15l-5.91 6.88 6.57 7.62h-3.17l-4.66-6.17-5.31 6.17H3.88l6.46-7.51-6.09-6.99Zm2.11 1.15 10.21 12.2h.94L7.31 5.9h-.95Z" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  );
}
