import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { authApi } from "../api/authApi";
import { AuthInput, AuthKeyIcon, AuthLockIcon } from "../components/AuthInput";
import { ErrorState } from "../components/ErrorState";

export function ResetPasswordPage() {
  const { token: routeToken } = useParams();
  const [token, setToken] = useState(routeToken ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const mutation = useMutation({
    mutationFn: authApi.resetPassword,
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError("");
    if (!token.trim() || newPassword.length < 8 || newPassword !== confirmPassword) {
      setValidationError("Token is required and passwords must match with at least 8 characters.");
      return;
    }
    mutation.mutate({ token, new_password: newPassword });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {(validationError || mutation.error) ? <ErrorState message={validationError || mutation.error?.message || "Reset failed"} /> : null}
      {mutation.data ? <div className="rounded-card border border-green-200 bg-success-50 p-4 text-sm font-medium text-success-700">{mutation.data}</div> : null}
      <AuthInput icon={<AuthKeyIcon />} label="Reset token" onChange={(event) => setToken(event.target.value)} placeholder="Paste reset token" value={token} />
      <AuthInput autoComplete="new-password" icon={<AuthLockIcon />} label="New password" onChange={(event) => setNewPassword(event.target.value)} placeholder="Enter new password" type="password" value={newPassword} />
      <AuthInput autoComplete="new-password" icon={<AuthLockIcon />} label="Confirm password" onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm new password" type="password" value={confirmPassword} />
      <button
        className="flex h-[54px] w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 via-indigo-500 to-sky-500 px-5 text-base font-bold text-white shadow-[0_18px_36px_rgba(79,70,229,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(59,130,246,0.32)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        disabled={mutation.isPending}
        type="submit"
      >
        {mutation.isPending ? "Resetting..." : "Reset password"}
      </button>
      <p className="pt-1 text-center text-sm text-muted">
        Done? <Link className="font-semibold text-brand-700 hover:underline" to="/login">Login</Link>
      </p>
    </form>
  );
}
