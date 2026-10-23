import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
      <div className="max-w-xl space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Mystery Message
        </h1>
        <p className="text-lg text-zinc-500">
          Get your own link and receive honest messages from anyone, completely
          anonymously.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/signup"
          className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Get started
        </Link>
        <Link
          href="/signin"
          className="rounded-full border border-black/15 px-6 py-3 text-sm font-semibold transition hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
