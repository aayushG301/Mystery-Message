import Link from "next/link";
import MessageCarousel from "@/src/components/MessageCarousel";

const STEPS = [
  { title: "Create your account", text: "Sign up with email, Google or GitHub and pick a username." },
  { title: "Share your link", text: "Copy your personal link and post it anywhere you like." },
  { title: "Read honest messages", text: "Anyone can write to you without revealing who they are." },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center gap-16 px-4 py-16 sm:py-24">
      <section className="max-w-2xl space-y-5 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Dive into the world of anonymous messages
        </h1>
        <p className="text-lg text-zinc-500">
          Get one link. Receive honest thoughts from friends, classmates and
          followers, with their identity kept secret.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/sign-up"
            className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Get your message board
          </Link>
          <Link
            href="/sign-in"
            className="rounded-full border border-black/15 px-6 py-3 text-sm font-semibold transition hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          >
            Sign in
          </Link>
        </div>
      </section>

      <MessageCarousel />

      <section className="w-full max-w-4xl space-y-8">
        <h2 className="text-center text-2xl font-semibold">How it works</h2>
        <ol className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="space-y-2 rounded-2xl border border-black/10 p-6 dark:border-white/15"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {i + 1}
              </span>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-sm text-zinc-500">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
