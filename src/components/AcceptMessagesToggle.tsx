"use client";

import { useState } from "react";
import type { ApiResponse } from "@/src/types/ApiResponse";

export default function AcceptMessagesToggle({ initial }: { initial: boolean }) {
  const [accepting, setAccepting] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleToggle() {
    const next = !accepting;
    setAccepting(next); 
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/accept-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acceptMessage: next }),
      });
      const data: ApiResponse = await res.json();
      if (!data.success) throw new Error(data.message);
    } catch (err) {
      setAccepting(!next); 
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium">Accept new messages</p>
        <p className="text-xs text-zinc-500">
          {accepting
            ? "Anyone with your link can message you."
            : "Your link is paused. Nobody can send you messages."}
        </p>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={accepting}
        aria-label="Accept new messages"
        onClick={handleToggle}
        disabled={saving}
        className={`relative h-6 w-11 shrink-0 rounded-full transition disabled:opacity-60 ${
          accepting ? "bg-blue-600" : "bg-zinc-400"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
            accepting ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
