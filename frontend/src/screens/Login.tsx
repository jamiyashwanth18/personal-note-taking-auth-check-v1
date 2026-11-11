import React from "react";
import { useNavigate } from "react-router-dom";

import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { brand } from "@/lib/brand";

const PRODUCT = "Personal note taking - auth check v1";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Screen() {
  const { signIn, register } = useAuth();
  const navigate = useNavigate();
  const [signUp, setSignUp] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const rule = `2px solid ${brand.primaryColor}`;
  const field = { border: rule, borderRadius: brand.radius, height: 44 };
  const errStyle = { color: brand.accentColor };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    const next: { email?: string; password?: string } = {};
    const trimmed = email.trim();
    if (!trimmed) next.email = "Enter your email.";
    else if (!EMAIL_RE.test(trimmed)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Enter your password.";
    else if (signUp && password.length < 8) next.password = "Use at least 8 characters.";
    setErrors(next);
    if (next.email || next.password) return;
    setBusy(true);
    try {
      if (signUp) await register(trimmed, password);
      else await signIn(trimmed, password);
      navigate("/notes");
    } catch (err) {
      const status = err instanceof ApiError ? err.status : 0;
      if (signUp && status === 409) setFormError("An account already exists for this email.");
      else if (!signUp && status === 401) setFormError("Incorrect email or password");
      else if (status === 422) setFormError("Check your email and password and try again.");
      else setFormError("Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="flex min-h-screen flex-col bg-white"
      style={{ color: brand.primaryColor, fontFamily: brand.fontBody }}
    >
      <header className="px-4 py-5 sm:px-10" style={{ borderBottom: rule }}>
        <p className="text-lg font-bold tracking-tight" style={{ fontFamily: brand.fontHeading }}>
          {PRODUCT}
        </p>
      </header>
      <main className="flex w-full max-w-md flex-col justify-center px-4 py-12 sm:px-10">
        <h1 className="text-4xl font-bold tracking-tight" style={{ fontFamily: brand.fontHeading }}>
          {signUp ? "Create account" : "Login"}
        </h1>
        <p className="mt-2 text-sm" style={{ color: brand.neutralColor }}>
          {signUp ? "Create an account to keep your private notes." : "Sign in to your notes."}
        </p>
        <form className="mt-10 space-y-5" onSubmit={submit} noValidate>
          <div className="space-y-2">
            <label
              htmlFor="login-email"
              className="block text-[11px] font-bold uppercase tracking-[0.16em]"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              className="w-full bg-white px-3 text-sm outline-none focus:ring-2"
              style={field}
            />
            {errors.email && (
              <p id="login-email-error" className="text-sm font-bold" style={errStyle}>
                {errors.email}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="login-password"
              className="block text-[11px] font-bold uppercase tracking-[0.16em]"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "login-password-error" : undefined}
              className="w-full bg-white px-3 text-sm outline-none focus:ring-2"
              style={field}
            />
            {errors.password && (
              <p id="login-password-error" className="text-sm font-bold" style={errStyle}>
                {errors.password}
              </p>
            )}
          </div>
          {formError && (
            <p role="alert" className="text-sm font-bold" style={errStyle}>
              {formError}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="h-11 w-full text-sm font-bold uppercase tracking-[0.16em] text-white disabled:opacity-50"
            style={{ backgroundColor: brand.primaryColor, borderRadius: brand.radius }}
          >
            {signUp ? "Create account" : "Sign in"}
          </button>
          <button
            type="button"
            className="min-h-[44px] text-sm font-bold underline"
            onClick={() => {
              setSignUp(!signUp);
              setErrors({});
              setFormError("");
            }}
          >
            {signUp ? "I already have an account" : "Create an account"}
          </button>
        </form>
      </main>
    </div>
  );
}
