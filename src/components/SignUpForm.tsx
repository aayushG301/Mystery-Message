"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/src/lib/auth-client";
import { signUpSchema } from "@/src/schema/signUp.schema";
import SocialButtons from "@/src/components/SocialButtons";
import UsernameField, { type UsernameStatus } from "@/src/components/UsernameField";
import {
  cardClass,
  errorClass,
  inputClass,
  primaryButtonClass,
} from "@/src/components/ui";

export default function SignUpForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const parsed = signUpSchema.safeParse({ username, email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    if (usernameStatus === "taken") {
      setError("That username is already taken");
      return;
    }

    setLoading(true);
    const { error: signUpError } = await authClient.signUp.email({
      name: parsed.data.username, 
      username: parsed.data.username,
      email: parsed.data.email,
      password: parsed.data.password,
      callbackURL: "/dashboard", 
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message ?? "Sign up failed");
      return;
    }

    router.push(`/check-email?email=${encodeURIComponent(parsed.data.email)}`);
  }

  return (
    <div className={`${cardClass} space-y-6`}>
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">Create your account</h1>
        <p className="text-sm text-zinc-500">
          Get your own link to receive anonymous messages
        </p>
      </div>

      {error && <p className={errorClass}>{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <UsernameField
          value={username}
          onChange={setUsername}
          onStatusChange={setUsernameStatus}
          disabled={loading}
        />
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className={inputClass}
            placeholder="At least 8 characters"
          />
        </div>
        <button type="submit" disabled={loading} className={primaryButtonClass}>
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <div className="flex items-center gap-3 text-xs text-zinc-500">
        <span className="h-px flex-1 bg-black/10 dark:bg-white/15" />
        or
        <span className="h-px flex-1 bg-black/10 dark:bg-white/15" />
      </div>

      <SocialButtons callbackURL="/dashboard" onError={setError} />

      <p className="text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/signin" className="font-medium text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
