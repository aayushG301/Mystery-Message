import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="text-zinc-500">We couldn&apos;t find that page or user.</p>
      <Link
        href="/"
        className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Go home
      </Link>
    </main>
  );
}
