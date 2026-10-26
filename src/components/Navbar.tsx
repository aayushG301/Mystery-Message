"use client";

import Link from "next/link";
import { authClient } from "@/src/lib/auth-client";
import SignOutButton from "@/src/components/SignOutButton";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const displayName = session?.user.username ?? session?.user.name;

  return (
    <header className="sticky top-0 z-20 border-b border-black/10 bg-background/80 backdrop-blur dark:border-white/15">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Mystery Message
        </Link>

        {/* Reserve the space while the session loads so the bar doesn't jump */}
        <div className="flex min-h-9 items-center gap-3">
          {isPending ? null : session ? (
            <>
              <span className="hidden text-sm text-zinc-500 sm:inline">
                Welcome, {displayName}
              </span>
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-1.5 text-sm font-medium transition hover:bg-black/5 dark:hover:bg-white/10"
              >
                Dashboard
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/sign-in"
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
