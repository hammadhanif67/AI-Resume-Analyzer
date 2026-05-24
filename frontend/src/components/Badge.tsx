import type { ReactNode } from "react";

import { cn } from "../utils/classNames";

interface BadgeProps {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "brand";
}

const tones = {
  neutral: "bg-panel text-muted ring-line",
  success: "bg-success-50 text-success-700 ring-green-200",
  warning: "bg-warning-50 text-warning-700 ring-yellow-200",
  danger: "bg-danger-50 text-danger-700 ring-red-200",
  brand: "bg-brand-50 text-brand-700 ring-brand-100",
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1", tones[tone])}>{children}</span>;
}
