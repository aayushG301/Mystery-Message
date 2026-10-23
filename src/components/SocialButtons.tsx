"use client";

import { useState } from "react";
import { authClient } from "@/src/lib/auth-client";
import { outlineButtonClass } from "@/src/components/ui";

type Provider = "github" | "google";

type Props = {
  callbackURL: string;
  onError?: (message: string) => void;
};

export default function SocialButtons({ callbackURL, onError }: Props) {
  const [loading, setLoading] = useState<Provider | null>(null);

  async function handleClick(provider: Provider) {
    setLoading(provider);
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL,
      newUserCallbackURL: "/onboarding", // first-time users pick a username
      errorCallbackURL: "/signin",
    });
    if (error) {
      onError?.(error.message ?? "Could not start social sign-in");
      setLoading(null);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        className={outlineButtonClass}
        disabled={loading !== null}
        onClick={() => handleClick("google")}
      >
        {loading === "google" ? "Redirecting..." : "Continue with Google"}
      </button>
      <button
        type="button"
        className={outlineButtonClass}
        disabled={loading !== null}
        onClick={() => handleClick("github")}
      >
        {loading === "github" ? "Redirecting..." : "Continue with GitHub"}
      </button>
    </div>
  );
}
