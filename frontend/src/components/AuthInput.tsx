import type { InputHTMLAttributes, ReactNode } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
}

export function AuthInput({ label, id, icon, ...props }: AuthInputProps) {
  const inputId = id ?? label.toLowerCase().replaceAll(" ", "-");

  return (
    <label className="block text-sm font-bold text-ink" htmlFor={inputId}>
      {label}
      <span className="auth-input-field mt-2 flex h-[52px] items-center gap-3 rounded-xl border border-slate-200 bg-white/86 px-4 text-slate-500 shadow-sm transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
        {icon}
        <input
          className="auth-input-control min-w-0 flex-1 border-0 bg-transparent text-[15px] leading-none text-ink shadow-none outline-none ring-0 placeholder:text-slate-400 focus:border-0 focus:outline-none focus:ring-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-70"
          id={inputId}
          {...props}
        />
      </span>
    </label>
  );
}

export function AuthMailIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24">
      <path d="M4 6.5h16v11H4v-11Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="m5 8 7 5 7-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

export function AuthLockIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24">
      <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M6 11h12v9H6v-9Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M12 15v2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

export function AuthUserIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

export function AuthKeyIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24">
      <path d="M14 10a5 5 0 1 0-1.5 3.6L16 17h3v3h3v-3.8l-5-5A5 5 0 0 0 14 10Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M7.5 10h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" />
    </svg>
  );
}
