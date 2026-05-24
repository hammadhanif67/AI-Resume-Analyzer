import { Link } from "react-router-dom";
import type { ReactNode } from "react";

import { PublicIcon, type PublicIconName } from "./PublicIcon";

export type IconTone = "accent" | "brand" | "violet" | "amber" | "slate" | "white";

type Align = "left" | "center";

interface IconBadgeProps {
  icon: PublicIconName;
  tone?: IconTone;
  className?: string;
}

interface PublicSectionProps {
  children: ReactNode;
  className?: string;
  tone?: "default" | "muted" | "plain";
}

interface SectionHeaderProps {
  align?: Align;
  eyebrow: string;
  icon?: PublicIconName;
  title: string;
  text?: string;
  className?: string;
}

interface FeatureCardProps {
  icon: PublicIconName;
  title: string;
  text: string;
  meta?: string;
  tone?: IconTone;
}

interface StatCardProps {
  icon: PublicIconName;
  value: string;
  label: string;
  tone?: IconTone;
}

interface ProcessStepCardProps {
  icon: PublicIconName;
  title: string;
  text: string;
  step: number;
  tone?: IconTone;
  hasConnector?: boolean;
}

interface CTASectionProps {
  icon?: PublicIconName;
  eyebrow?: string;
  title: string;
  text: string;
  primaryTo: string;
  primaryLabel: string;
  secondaryTo?: string;
  secondaryLabel?: string;
}

export function IconBadge({ icon, tone = "accent", className = "" }: IconBadgeProps) {
  return (
    <span className={`public-icon-badge ${tone} ${className}`}>
      <PublicIcon name={icon} />
    </span>
  );
}

export function PublicSection({ children, className = "", tone = "default" }: PublicSectionProps) {
  const tones = {
    default: "public-section",
    muted: "public-section public-section-muted",
    plain: "",
  };

  return (
    <section className={`${tones[tone]} ${className}`}>
      <div className="public-container">{children}</div>
    </section>
  );
}

export function SectionHeader({ align = "center", eyebrow, icon, title, text, className = "" }: SectionHeaderProps) {
  return (
    <div className={`${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl"} ${className}`}>
      <p className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-normal text-brand-700 ${align === "center" ? "justify-center" : ""}`}>
        {icon ? <PublicIcon className="h-3.5 w-3.5" name={icon} /> : null}
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-black leading-tight text-ink sm:text-4xl">{title}</h2>
      {text ? <p className="mt-3 text-base font-medium leading-7 text-muted">{text}</p> : null}
    </div>
  );
}

export function FeatureCard({ icon, title, text, meta, tone = "accent" }: FeatureCardProps) {
  return (
    <article className="public-card flex flex-col p-5">
      <IconBadge icon={icon} tone={tone} />
      <h3 className="mt-4 text-base font-black leading-snug text-ink">{title}</h3>
      <p className="mt-2 flex-1 text-sm font-medium leading-6 text-muted">{text}</p>
      {meta ? (
        <p className="mt-4 flex items-center gap-2 border-t border-line pt-4 text-sm font-black text-brand-700">
          <PublicIcon className="h-4 w-4" name="checkCircle" />
          {meta}
        </p>
      ) : null}
    </article>
  );
}

export function StatCard({ icon, value, label, tone = "brand" }: StatCardProps) {
  return (
    <article className="public-card public-stat-card flex min-h-[6.25rem] items-center gap-4 p-5">
      <IconBadge icon={icon} tone={tone} />
      <div className="min-w-0">
        <p className="text-2xl font-black leading-none text-ink">{value}</p>
        <p className="mt-1 text-sm font-semibold leading-5 text-muted">{label}</p>
      </div>
    </article>
  );
}

export function ProcessStepCard({ icon, title, text, step, tone = "accent", hasConnector = false }: ProcessStepCardProps) {
  return (
    <article className="public-card relative p-5">
      {hasConnector ? <span className="public-step-connector" /> : null}
      <div className="flex items-start gap-4">
        <IconBadge icon={icon} tone={tone} />
        <div className="min-w-0">
          <p className="text-xs font-black uppercase text-brand-700">Step {String(step).padStart(2, "0")}</p>
          <h3 className="mt-1 text-base font-black leading-snug text-ink">{title}</h3>
          <p className="mt-2 text-sm font-medium leading-6 text-muted">{text}</p>
        </div>
      </div>
    </article>
  );
}

export function CTASection({ icon = "rocket", eyebrow = "Ready when you are", title, text, primaryTo, primaryLabel, secondaryTo, secondaryLabel }: CTASectionProps) {
  return (
    <PublicSection className="pb-14 pt-4" tone="plain">
      <div className="public-cta grid gap-5 p-6 sm:p-7 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
        <IconBadge className="bg-white/10 text-white shadow-none" icon={icon} tone="white" />
        <div className="min-w-0">
          <p className="text-xs font-black uppercase text-white/70">{eyebrow}</p>
          <h2 className="mt-2 text-2xl font-black leading-tight text-white sm:text-3xl">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-white/76">{text}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          {secondaryTo && secondaryLabel ? (
            <Link className="public-button border border-white/18 bg-white/8 text-white hover:bg-white/12" to={secondaryTo}>
              {secondaryLabel}
            </Link>
          ) : null}
          <Link className="public-button bg-white text-ink shadow-sm" to={primaryTo}>
            {primaryLabel}
            <PublicIcon className="h-4 w-4" name="arrowRight" />
          </Link>
        </div>
      </div>
    </PublicSection>
  );
}
