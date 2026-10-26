import { Suspense } from "react";
import ResetPasswordForm from "@/src/components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      {/* The form reads ?token= from the URL, so it needs a boundary */}
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
