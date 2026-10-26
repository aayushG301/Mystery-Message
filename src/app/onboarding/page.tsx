import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/src/lib/session";
import OnboardingForm from "@/src/components/OnboardingForm";
import { cardClass } from "@/src/components/ui";

export default function OnboardingPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className={`${cardClass} space-y-6`}>
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold">Pick a username</h1>
          <p className="text-sm text-zinc-500">
            This becomes your public link for receiving messages.
          </p>
        </div>
        <Suspense fallback={<p className="text-sm text-zinc-500">Loading...</p>}>
          <OnboardingGate />
        </Suspense>
      </div>
    </main>
  );
}

async function OnboardingGate() {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  if (session.user.username) redirect("/dashboard");
  return <OnboardingForm />;
}
