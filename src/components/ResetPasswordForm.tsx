"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/src/lib/auth-client";
import { resetPasswordSchema } from "@/src/schema/signIn.schema";
import {
  cardClass,
  errorClass,
  infoClass,
  inputClass,
  primaryButtonClass,
} from "@/src/components/ui";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const linkInvalid = !token || searchParams.get("error") !== null;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!token) return;

    const parsed = resetPasswordSchema.safeParse({ password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid password");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const { error: resetError } = await authClient.resetPassword({
      newPassword: parsed.data.password,
      token,
    });
    setLoading(false);

    if (resetError) {
      setError(resetError.message ?? "This link is invalid or has expired");
      return;
    }
    setDone(true);
  }

  return (
    <div className={`${cardClass} space-y-6`}>
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">Choose a new password</h1>
      </div>

      {linkInvalid ? (
        <div className="space-y-4 text-center">
          <p className={errorClass}>
            This reset link is invalid or has expired.
          </p>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Request a new link
          </Link>
        </div>
      ) : done ? (
        <div className="space-y-4 text-center">
          <p className={infoClass}>Your password has been updated.</p>
          <Link
            href="/sign-in"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && <p className={errorClass}>{error}</p>}
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium">
              New password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className={inputClass}
              placeholder="At least 8 characters"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="confirm" className="text-sm font-medium">
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={loading}
              className={inputClass}
            />
          </div>
          <button type="submit" disabled={loading} className={primaryButtonClass}>
            {loading ? "Saving..." : "Update password"}
          </button>
        </form>
      )}
    </div>
  );
}
