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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setLoading(true);
    const { error: signInError } = await authClient.signIn.email({
      email: parsed.data.email,
      password: parsed.data.password,
      rememberMe: true,
      callbackURL, // better-auth redirects here on success
    });

    if (signInError) {
      setLoading(false);
      if (signInError.status === 403) {
        // Email not verified. better-auth has already sent a fresh link.
        router.push(`/check-email?email=${encodeURIComponent(parsed.data.email)}`);
        return;
      }
      setError("Invalid email or password");
    }
    // On success the page is redirected, so the loading state stays on.
  }

  return (
    <div className={`${cardClass} space-y-6`}>
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-zinc-500">Sign in to see your messages</p>
      </div>

      {(oauthFailed || error) && (
        <p className={errorClass}>
          {error ?? "Social sign-in failed. Please try again."}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
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
        New here?{" "}
        <Link href="/signup" className="font-medium text-blue-600 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
