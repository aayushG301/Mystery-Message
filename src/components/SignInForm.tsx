"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/src/lib/auth-client";
import { signInSchema } from "@/src/schema/signIn.schema";
import SocialButtons from "@/src/components/SocialButtons";
import {
  cardClass,
  errorClass,
  inputClass,
  primaryButtonClass,
} from "@/src/components/ui";

// Only allow in-app paths, so ?callbackUrl= can't be used for open redirects.
function safeCallback(value: string | null) {
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return "/dashboard";
}

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackURL = safeCallback(searchParams.get("callbackUrl"));
  const oauthFailed = searchParams.get("error") !== null;

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const parsed = signInSchema.safeParse({ identifier, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    const { identifier: id, password: pw } = parsed.data;
    const isEmail = id.includes("@");

    setLoading(true);
    // One box, two ways in: an "@" means email, otherwise it's a username.
    const { error: signInError } = isEmail
      ? await authClient.signIn.email({
          email: id,
          password: pw,
          rememberMe: true,
          callbackURL, // better-auth redirects here on success
        })
      : await authClient.signIn.username({
          username: id,
          password: pw,
          rememberMe: true,
          callbackURL,
        });

    if (signInError) {
      setLoading(false);
      if (signInError.status === 403) {
        // Email not verified. better-auth has already sent a fresh link.
        router.push(
          isEmail
            ? `/check-email?email=${encodeURIComponent(id)}`
            : "/check-email",
        );
        return;
      }
      setError("Invalid email/username or password");
    }
    // On success the page is redirected, so the loading state stays on.
  }

  return (
    <div className={`${cardClass} space-y-6`}>
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-zinc-500">
          Sign in to continue your secret conversations
        </p>
      </div>

      {(oauthFailed || error) && (
        <p className={errorClass}>
          {error ?? "Social sign-in failed. Please try again."}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1">
          <label htmlFor="identifier" className="text-sm font-medium">
            Email or username
          </label>
          <input
            id="identifier"
            type="text"
            autoComplete="username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            disabled={loading}
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className={inputClass}
          />
        </div>
        <button type="submit" disabled={loading} className={primaryButtonClass}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="flex items-center gap-3 text-xs text-zinc-500">
        <span className="h-px flex-1 bg-black/10 dark:bg-white/15" />
        or
        <span className="h-px flex-1 bg-black/10 dark:bg-white/15" />
      </div>

      <SocialButtons callbackURL={callbackURL} onError={setError} />

      <p className="text-center text-sm text-zinc-500">
        Not a member yet?{" "}
        <Link href="/sign-up" className="font-medium text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
