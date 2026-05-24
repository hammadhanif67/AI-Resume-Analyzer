import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { authApi } from "../api/authApi";
import { AuthInput, AuthLockIcon, AuthMailIcon, AuthUserIcon } from "../components/AuthInput";
import { ErrorState } from "../components/ErrorState";

export function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const mutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      navigate("/login", { state: { successMessage: "Account created successfully. Please login." } });
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError("");
    if (!name.trim() || !email.trim() || password.length < 8) {
      setValidationError("Name, valid email, and an 8 character password are required.");
      return;
    }
    mutation.mutate({ name, email, password });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {(validationError || mutation.error) ? (
        <ErrorState message={validationError || mutation.error?.message || "Signup failed"} />
      ) : null}
      <AuthInput autoComplete="name" icon={<AuthUserIcon />} label="Name" onChange={(event) => setName(event.target.value)} placeholder="Enter your name" value={name} />
      <AuthInput autoComplete="email" icon={<AuthMailIcon />} label="Email address" onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email" type="email" value={email} />
      <AuthInput autoComplete="new-password" icon={<AuthLockIcon />} label="Password" onChange={(event) => setPassword(event.target.value)} placeholder="Create a password" type="password" value={password} />
      <button
        className="flex h-[54px] w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 via-indigo-500 to-sky-500 px-5 text-base font-bold text-white shadow-[0_18px_36px_rgba(79,70,229,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(59,130,246,0.32)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        disabled={mutation.isPending}
        type="submit"
      >
        {mutation.isPending ? "Creating account..." : "Sign up"}
      </button>
      <p className="pt-1 text-center text-sm text-muted">
        Already have an account? <Link className="font-semibold text-brand-700 hover:underline" to="/login">Login</Link>
      </p>
    </form>
  );
}
