import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { authApi } from "../api/authApi";
import { ErrorState } from "../components/ErrorState";
import { useAuthStore } from "../store/authStore";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.access_token, data.user);
      navigate("/dashboard");
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError("");
    if (!email.trim() || !password) {
      setValidationError("Email and password are required.");
      return;
    }
    mutation.mutate({ email, password });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {location.state?.successMessage ? (
        <div className="rounded-card border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700" role="status">
          {location.state.successMessage}
        </div>
      ) : null}
      {(validationError || mutation.error) ? (
        <ErrorState message={validationError || mutation.error?.message || "Login failed"} />
      ) : null}
      <label className="block text-sm font-bold text-ink" htmlFor="email">
        Email address
        <span className="auth-input-field mt-2 flex h-[52px] items-center gap-3 rounded-xl border border-slate-200 bg-white/86 px-4 text-slate-500 shadow-sm transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
          <MailIcon />
          <input
            autoComplete="email"
            className="auth-input-control min-w-0 flex-1 border-0 bg-transparent text-[15px] font-normal leading-none text-ink shadow-none outline-none ring-0 placeholder:font-normal placeholder:text-slate-400 focus:border-0 focus:outline-none focus:ring-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0"
            id="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            type="email"
            value={email}
          />
        </span>
      </label>
      <label className="block text-sm font-bold text-ink" htmlFor="password">
        Password
        <span className="auth-input-field mt-2 flex h-[52px] items-center gap-3 rounded-xl border border-slate-200 bg-white/86 px-4 text-slate-500 shadow-sm transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
          <LockIcon />
          <input
            autoComplete="current-password"
            className="auth-password-input min-w-0 flex-1 border-0 bg-transparent text-[15px] font-normal leading-none text-ink shadow-none outline-none ring-0 placeholder:font-normal placeholder:text-slate-400 focus:border-0 focus:outline-none focus:ring-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0"
            id="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            value={password}
          />
          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="auth-password-toggle grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-ink"
            onClick={() => setShowPassword((current) => !current)}
            type="button"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </span>
      </label>
      <div className="-mt-1 text-right">
        <Link className="text-sm font-semibold text-brand-700 hover:underline" to="/forgot-password">Forgot password?</Link>
      </div>
      <button
        className="flex h-[54px] w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-500 to-sky-500 px-5 text-base font-bold text-white shadow-[0_16px_32px_rgba(79,70,229,0.26)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(59,130,246,0.3)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        disabled={mutation.isPending}
        type="submit"
      >
        {mutation.isPending ? "Signing in..." : "Sign in"}
        <ArrowIcon />
      </button>
      <p className="pt-1 text-center text-sm text-slate-600">
        New here? <Link className="font-semibold text-brand-700 hover:underline" to="/signup">Create an account</Link>
      </p>
    </form>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24">
      <path d="M4 6.5h16v11H4v-11Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="m5 8 7 5 7-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24">
      <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M6 11h12v9H6v-9Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M12 15v2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M3 12s3.2-5 9-5 9 5 9 5-3.2 5-9 5-9-5-9-5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="m4 4 16 16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M9.4 6.5A9.8 9.8 0 0 1 12 6c5.8 0 9 6 9 6a15.1 15.1 0 0 1-3 3.7M6.5 8.2A15.7 15.7 0 0 0 3 12s3.2 6 9 6c1 0 2-.2 2.8-.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M10.6 10.6a2.5 2.5 0 0 0 2.8 2.8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" />
    </svg>
  );
}
