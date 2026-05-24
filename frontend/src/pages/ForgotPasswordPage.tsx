import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

import { authApi } from "../api/authApi";
import { AuthInput, AuthMailIcon } from "../components/AuthInput";
import { ErrorState } from "../components/ErrorState";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState("");

  const mutation = useMutation({
    mutationFn: authApi.forgotPassword,
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError("");
    if (!email.trim()) {
      setValidationError("Email is required.");
      return;
    }
    mutation.mutate({ email });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {(validationError || mutation.error) ? <ErrorState message={validationError || mutation.error?.message || "Request failed"} /> : null}
      {mutation.data ? <div className="rounded-card border border-green-200 bg-success-50 p-4 text-sm font-medium text-success-700">{mutation.data}</div> : null}
      <AuthInput autoComplete="email" icon={<AuthMailIcon />} label="Email address" onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email" type="email" value={email} />
      <button
        className="flex h-[54px] w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 via-indigo-500 to-sky-500 px-5 text-base font-bold text-white shadow-[0_18px_36px_rgba(79,70,229,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(59,130,246,0.32)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        disabled={mutation.isPending}
        type="submit"
      >
        {mutation.isPending ? "Sending..." : "Send reset link"}
      </button>
      <p className="pt-1 text-center text-sm text-muted">
        Remembered it? <Link className="font-semibold text-brand-700 hover:underline" to="/login">Login</Link>
      </p>
    </form>
  );
}
