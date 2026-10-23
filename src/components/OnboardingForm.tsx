"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/src/lib/auth-client";
import { usernameValidation } from "@/src/schema/signUp.schema";
import UsernameField, { type UsernameStatus } from "@/src/components/UsernameField";
import { errorClass, primaryButtonClass } from "@/src/components/ui";

// For users who signed up with Google/GitHub and still need a username.
export default function OnboardingForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<UsernameStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const parsed = usernameValidation.safeParse(username);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid username");
      return;
    }
    if (status === "taken") {
      setError("That username is already taken");
      return;
    }

    setLoading(true);
    const { error: updateError } = await authClient.updateUser({
      username: parsed.data,
    });
    setLoading(false);

    if (updateError) {
      setError(updateError.message ?? "Could not save the username");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error && <p className={errorClass}>{error}</p>}
      <UsernameField
        value={username}
        onChange={setUsername}
        onStatusChange={setStatus}
        disabled={loading}
      />
      <button type="submit" disabled={loading} className={primaryButtonClass}>
        {loading ? "Saving..." : "Continue"}
      </button>
    </form>
  );
}
