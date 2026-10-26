import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/src/lib/session";
import { getMessagesForUser } from "@/src/lib/messages";
import CopyLinkButton from "@/src/components/CopyLinkButton";
import AcceptMessagesToggle from "@/src/components/AcceptMessagesToggle";
import MessageList from "@/src/components/MessageList";

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 space-y-8 px-4 py-10">
      {/* Everything that reads the session streams in behind this boundary */}
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading your dashboard...</p>}>
        <DashboardContent />
      </Suspense>
    </main>
  );
}

async function DashboardContent() {
  // The proxy only checks that a cookie exists; this is the real check.
  const session = await getSession();
  if (!session) redirect("/sign-in");
  // Social sign-ups have no username yet.
  if (!session.user.username) redirect("/onboarding");

  const { user } = session;
  const messages = await getMessagesForUser(user.id);
  const baseUrl = process.env.BETTER_AUTH_URL ?? "";
  const profileUrl = `${baseUrl}/u/${user.username}`;

  return (
    <>
      <header>
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <p className="text-sm text-zinc-500">
          Signed in as {user.username} ({user.email})
        </p>
      </header>

      <section className="space-y-3 rounded-xl border border-black/10 p-4 dark:border-white/15">
        <p className="text-sm font-medium">Copy your unique link</p>
        <div className="flex items-center justify-between gap-3">
          <code className="min-w-0 truncate rounded bg-black/5 px-2 py-1 text-sm dark:bg-white/10">
            {profileUrl}
          </code>
          <CopyLinkButton url={profileUrl} />
        </div>
      </section>

      <section className="rounded-xl border border-black/10 p-4 dark:border-white/15">
        <AcceptMessagesToggle initial={user.isAcceptingMessage ?? true} />
      </section>

      <MessageList initialMessages={messages} />
    </>
  );
}
