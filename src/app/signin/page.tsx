import { Suspense } from "react";
import SignInForm from "@/src/components/SignInForm";

export default function SignInPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      {/* SignInForm reads the URL (useSearchParams), so it needs a boundary */}
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading...</p>}>
        <SignInForm />
      </Suspense>
    </main>
  );
}
