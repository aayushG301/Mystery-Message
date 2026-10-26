"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { authClient } from "@/src/lib/auth-client";
import { forgotPasswordSchema } from "@/src/schema/signIn.schema";
import {
  cardClass,
  errorClass,
  infoClass,
  inputClass,
  primaryButtonClass,
} from "@/src/components/ui";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid email");
      return;
    }

    setLoading(true);
    await authClient.requestPasswordReset({
      email: parsed.data.email,
      redirectTo: "/reset-password",
    });
    setLoading(false);
    // Same answer whether or not the account exists, so emails can't be probed.
    setSent(true);
  }

  return (
    <div className={`${cardClass} space-y-6`}>
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">Forgot your password?</h1>
        <p className="text-sm text-zinc-500">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {sent ? (
        <p className={infoClass}>
          If an account exists for that email, a reset link is on its way. It
          expires in 1 hour.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && <p className={errorClass}>{error}</p>}
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>
          <button type="submit" disabled={loading} className={primaryButtonClass}>
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
      )}

      <p className="text-center text-sm">
        <Link href="/sign-in" className="font-medium text-blue-600 hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
