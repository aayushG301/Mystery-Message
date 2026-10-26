"use client";

import { useState } from "react";
import type { ApiResponse, MessageItem } from "@/src/types/ApiResponse";

// Fixed locale + UTC so the server render and the browser render match.
function formatDate(iso: string) {
  return (
    new Date(iso).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "UTC",
    }) + " UTC"
  );
}

export default function MessageList({
  initialMessages,
}: {
  initialMessages: MessageItem[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRefresh() {
    setRefreshing(true);
    setError(null);
    try {
      const res = await fetch("/api/get-messages");
      const data: ApiResponse = await res.json();
      if (!data.success) throw new Error(data.message);
      setMessages(data.messages ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not refresh");
    } finally {
      setRefreshing(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this message? This can't be undone.")) return;
    setError(null);
    try {
      const res = await fetch(`/api/delete-message/${id}`, { method: "DELETE" });
      const data: ApiResponse = await res.json();
      if (!data.success) throw new Error(data.message);
      setMessages((current) => current.filter((m) => m.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete");
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your messages</h2>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="rounded-lg border border-black/15 px-3 py-1.5 text-sm font-medium transition hover:bg-black/5 disabled:opacity-60 dark:border-white/20 dark:hover:bg-white/10"
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {messages.length === 0 ? (
        <p className="rounded-xl border border-dashed border-black/15 p-8 text-center text-sm text-zinc-500 dark:border-white/20">
          No messages yet. Share your link to get started.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {messages.map((m) => (
            <li
              key={m.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-black/10 p-4 shadow-sm dark:border-white/15"
            >
              <div className="space-y-1">
                <p className="whitespace-pre-wrap break-words text-sm">{m.content}</p>
                <p className="text-xs text-zinc-500">{formatDate(m.createdAt)}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(m.id)}
                className="shrink-0 text-xs font-medium text-red-600 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
