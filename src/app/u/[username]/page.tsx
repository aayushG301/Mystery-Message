import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { findUserByUsername } from "@/src/lib/users";
import SendMessageForm from "@/src/components/SendMessageForm";
import { cardClass } from "@/src/components/ui";

type Params = Promise<{ username: string }>;

export default function PublicProfilePage({ params }: { params: Params }) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className={`${cardClass} space-y-6`}>
        {/* params + a database lookup are request-time work */}
        <Suspense fallback={<p className="text-sm text-zinc-500">Loading...</p>}>
          <Profile params={params} />
        </Suspense>
        <p className="text-center text-sm text-zinc-500">
          Want your own message board?{" "}
          <Link href="/sign-up" className="font-medium text-blue-600 hover:underline">
            Get yours
          </Link>
        </p>
      </div>
    </main>
  );
}

async function Profile({ params }: { params: Params }) {
  // Opt this component into request-time rendering before any database work,
  // because the database driver reads the current time internally.
  await connection();

  const { username } = await params;
  const user = await findUserByUsername(decodeURIComponent(username));
  if (!user) notFound();

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">Message @{user.username}</h1>
        <p className="text-sm text-zinc-500">
          Send an honest message. They will never know it was you.
        </p>
      </div>
      {user.isAcceptingMessage ? (
        <SendMessageForm username={user.username} />
      ) : (
        <p className="rounded-lg border border-dashed border-black/15 p-6 text-center text-sm text-zinc-500 dark:border-white/20">
          @{user.username} isn&apos;t accepting messages right now.
        </p>
      )}
    </div>
  );
}