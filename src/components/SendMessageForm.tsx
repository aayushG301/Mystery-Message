"use client";

import { useState, type FormEvent } from "react";
import { messageSchema } from "@/src/schema/message.schema";
import type { ApiResponse } from "@/src/types/ApiResponse";
import { errorClass, infoClass, primaryButtonClass } from "@/src/components/ui";

const SUGGESTIONS = [
  "What's something you're proud of that most people don't know?",
  "If you could master any skill overnight, what would it be?",
  "What's the best advice you've ever received?",
];

export default function SendMessageForm({ username }: { username: string }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(
    null,
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResult(null);

    const parsed = messageSchema.safeParse({ content });
    if (!parsed.success) {
      setResult({
        ok: false,
        text: parsed.error.issues[0]?.message ?? "Invalid message",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, content: parsed.data.content }),
      });
      const data: ApiResponse = await res.json();
      if (!data.success) throw new Error(data.message);

      setContent("");
      setResult({ ok: true, text: "Your anonymous message was sent." });
    } catch (err) {
      setResult({
        ok: false,
        text: err instanceof Error ? err.message : "Could not send the message",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
        rows={5}
        maxLength={500}
        placeholder="Write your anonymous message here..."
        className="w-full resize-none rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-white/20"
      />
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>Your identity is never shared.</span>
        <span>{content.length}/500</span>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-zinc-500">
          Need an idea? Tap one to use it:
        </p>
        <div className="flex flex-col gap-2">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              disabled={loading}
              onClick={() => setContent(suggestion)}
              className="rounded-lg border border-black/10 px-3 py-2 text-left text-xs transition hover:bg-black/5 disabled:opacity-60 dark:border-white/15 dark:hover:bg-white/10"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
      {result && (
        <p className={result.ok ? infoClass : errorClass}>{result.text}</p>
      )}
      <button
        type="submit"
        disabled={loading || content.trim() === ""}
        className={primaryButtonClass}
      >
        {loading ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
