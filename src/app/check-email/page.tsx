import { Suspense } from "react";
import Link from "next/link";
import ResendVerificationButton from "@/src/components/ResendVerificationButton";
import { cardClass } from "@/src/components/ui";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function CheckEmailPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className={`${cardClass} space-y-6 text-center`}>
        <h1 className="text-2xl font-semibold">Check your email</h1>
        {/* searchParams is request data, so it is read behind a boundary */}
        <Suspense fallback={<p className="text-sm text-zinc-500">Loading...</p>}>
          <EmailDetails searchParams={searchParams} />
        </Suspense>
        <Link
          href="/signin"
          className="block text-sm font-medium text-blue-600 hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    </main>
  );
}

async function EmailDetails({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const raw = params.email;
  const email = typeof raw === "string" && raw.includes("@") ? raw : null;

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-sm text-zinc-500">
        <p>
          {email ? (
            <>
              We sent a verification link to{" "}
              <span className="font-medium text-foreground">{email}</span>.
            </>
          ) : (
            "We sent you a verification link."
          )}
        </p>
        <p>Click it to activate your account. Check your spam folder too.</p>
      </div>
      {email && <ResendVerificationButton email={email} />}
    </div>
  );
}
