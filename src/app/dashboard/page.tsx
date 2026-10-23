import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/src/lib/session";
import { getMessagesForUser } from "@/src/lib/messages";
import SignOutButton from "@/src/components/SignOutButton";
import CopyLinkButton from "@/src/components/CopyLinkButton";
import AcceptMessagesToggle from "@/src/components/AcceptMessagesToggle";
import MessageList from "@/src/components/MessageList";

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 space-y-8 px-4 py-10">
      {}
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading your dashboard...</p>}>
        <DashboardContent />
      </Suspense>
    </main>
  );
}

async function DashboardContent() {
  const session = await getSession();
  if (!session) redirect("/signin");
  if (!session.user.username) redirect("/onboarding");

  const { user } = session;
  const messages = await getMessagesForUser(user.id);
  const baseUrl = process.env.BETTER_AUTH_URL ?? "";
  const profileUrl = `${baseUrl}/u/${user.username}`;

  return (
    <>
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Hi, {user.username}</h1>
          <p className="text-sm text-zinc-500">{user.email}</p>
        </div>
        <SignOutButton />
      </header>

      <section className="space-y-3 rounded-xl border border-black/10 p-4 dark:border-white/15">
        <p className="text-sm font-medium">Your public link</p>
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
