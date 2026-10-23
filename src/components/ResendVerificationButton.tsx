"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/src/lib/auth-client";
import { errorClass, infoClass, outlineButtonClass } from "@/src/components/ui";

const COOLDOWN_SECONDS = 60;

export default function ResendVerificationButton({ email }: { email: string }) {
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null,
  );

  // Count down one second at a time while the cooldown is active.
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  async function handleResend() {
    setSending(true);
    setMessage(null);
    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: "/dashboard",
    });
    setSending(false);

    if (error) {
      setMessage({ ok: false, text: error.message ?? "Could not send the email" });
      return;
    }
    setMessage({ ok: true, text: "A new link is on its way." });
    setCooldown(COOLDOWN_SECONDS);
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleResend}
        disabled={sending || cooldown > 0}
        className={outlineButtonClass}
      >
        {sending
          ? "Sending..."
          : cooldown > 0
            ? `Resend available in ${cooldown}s`
            : "Resend verification email"}
      </button>
      {message && (
        <p className={message.ok ? infoClass : errorClass}>{message.text}</p>
      )}
    </div>
  );
}
