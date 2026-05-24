import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "../utils/classNames";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  fullWidth?: boolean;
  children: ReactNode;
}

const variants = {
  primary: "bg-gradient-to-r from-violet-600 to-brand-600 text-white shadow-[0_12px_24px_rgba(79,70,229,0.18)] hover:-translate-y-px hover:shadow-[0_16px_30px_rgba(37,99,235,0.22)] disabled:from-violet-600 disabled:to-brand-600",
  secondary: "border border-line bg-white text-ink shadow-sm hover:-translate-y-px hover:border-brand-200 hover:bg-brand-50",
  ghost: "text-muted hover:bg-slate-50 hover:text-ink",
  danger: "bg-danger-700 text-white shadow-soft hover:-translate-y-px hover:bg-red-800 disabled:bg-danger-700",
};

export function Button({ variant = "primary", fullWidth, className, children, type = "button", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center rounded-lg px-4 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60",
        variants[variant],
        fullWidth && "w-full",
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
