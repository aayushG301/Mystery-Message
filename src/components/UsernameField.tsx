"use client";

import { useRef, useState } from "react";
import { authClient } from "@/src/lib/auth-client";
import { usernameValidation } from "@/src/schema/signUp.schema";
import { inputClass } from "@/src/components/ui";

export type UsernameStatus =
  | "idle"
  | "checking"
  | "available"
  | "taken"
  | "invalid";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onStatusChange?: (status: UsernameStatus) => void;
  disabled?: boolean;
};

// Username input with a debounced "is it available?" check.
export default function UsernameField({
  value,
  onChange,
  onStatusChange,
  disabled,
}: Props) {
  const [status, setStatus] = useState<UsernameStatus>("idle");
  const [hint, setHint] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef(0); // ignore responses from older keystrokes

  function update(next: UsernameStatus, message = "") {
    setStatus(next);
    setHint(message);
    onStatusChange?.(next);
  }

  function handleChange(raw: string) {
    onChange(raw);
    if (timer.current) clearTimeout(timer.current);
    const requestId = ++latest.current;

    if (raw === "") {
      update("idle");
      return;
    }

    const parsed = usernameValidation.safeParse(raw);
    if (!parsed.success) {
      update("invalid", parsed.error.issues[0]?.message ?? "Invalid username");
      return;
    }

    update("checking", "Checking availability...");
    timer.current = setTimeout(async () => {
      const { data, error } = await authClient.isUsernameAvailable({
        username: raw,
      });
      if (requestId !== latest.current) return;

      if (error) {
        update("invalid", "Could not check the username");
      } else if (data?.available) {
        update("available", "Username is available");
      } else {
        update("taken", "Username is already taken");
      }
    }, 500);
  }

  const hintColor =
    status === "available"
      ? "text-green-600"
      : status === "taken" || status === "invalid"
        ? "text-red-600"
        : "text-zinc-500";

  return (
    <div className="space-y-1">
      <label htmlFor="username" className="text-sm font-medium">
        Username
      </label>
      <input
        id="username"
        name="username"
        type="text"
        autoComplete="username"
        value={value}
        disabled={disabled}
        onChange={(e) => handleChange(e.target.value)}
        className={inputClass}
        placeholder="your_username"
      />
      {hint && <p className={`text-xs ${hintColor}`}>{hint}</p>}
    </div>
  );
}
