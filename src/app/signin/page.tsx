"use client";

import { authClient } from "@/src/lib/auth-client";

export default function SignInPage() {
  async function handleSignin() {
    const { data, error } = await authClient.signIn.email({
      email: "",
      password: "",
      rememberMe: true,
      callbackURL: "https://example.com/callback",
    },
  {
    onError(ctx) {
      console.error("Email not verified:", ctx);
    }
  },
  );
    if (error) {
      console.error("Sign-in error:", error);
      return; 
    }
    console.log("Sign-in successful:", data);
  }
  return <button onClick={handleSignin}>Sign in</button>;
}
