"use client";

import { useEffect, useState } from "react";

const SAMPLE_MESSAGES = [
  { from: "A curious friend", text: "Your last talk was the best one I've seen all year.", when: "10 minutes ago" },
  { from: "Secret admirer", text: "I really liked the way you handled that tough group project.", when: "2 hours ago" },
  { from: "Mystery guest", text: "Any book recommendations for a long train ride?", when: "1 day ago" },
  { from: "Someone who cares", text: "You're more talented than you give yourself credit for.", when: "3 days ago" },
];

export default function MessageCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = SAMPLE_MESSAGES.length;

  // Auto-advance, unless hovered or the visitor prefers reduced motion.
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 4000);
    return () => clearInterval(id);
  }, [paused, count]);

  return (
    <div
      className="mx-auto w-full max-w-xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="overflow-hidden rounded-2xl border border-black/10 shadow-sm dark:border-white/15">
        <div
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {SAMPLE_MESSAGES.map((m) => (
            <article key={m.from} className="w-full shrink-0 space-y-3 p-8 text-left">
              <h3 className="text-sm font-semibold text-blue-600">
                Message from {m.from}
              </h3>
              <p className="text-lg">{m.text}</p>
              <p className="text-xs text-zinc-500">{m.when}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Previous message"
          onClick={() => setIndex((i) => (i - 1 + count) % count)}
          className="rounded-full border border-black/15 px-3 py-1 text-sm transition hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
        >
          ←
        </button>
        <div className="flex gap-2">
          {SAMPLE_MESSAGES.map((m, i) => (
            <button
              key={m.from}
              type="button"
              aria-label={`Show message ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full transition ${
                i === index ? "bg-blue-600" : "bg-zinc-300 dark:bg-zinc-600"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next message"
          onClick={() => setIndex((i) => (i + 1) % count)}
          className="rounded-full border border-black/15 px-3 py-1 text-sm transition hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
        >
          →
        </button>
      </div>
    </div>
  );
}
