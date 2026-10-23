import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@/src/lib/auth";

// Real session check (hits the database). Call this from server components
// that sit behind <Suspense>, because it reads request headers.
export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});
