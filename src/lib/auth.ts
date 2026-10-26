import { betterAuth } from "better-auth/minimal";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { username } from "better-auth/plugins";
import { client } from "@/src/lib/db";
import { sendVerificationEmail } from "@/src/helpers/sendVerificationEmail";
import { sendResetPasswordEmail } from "@/src/helpers/sendResetPasswordEmail";

export const auth = betterAuth({
  database: mongodbAdapter(client.db(), { client }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
    sendResetPassword: async ({ user, url }) => {
      // Not awaited on purpose (avoids timing differences between known and
      // unknown emails). On serverless hosts, wrap in waitUntil instead.
      void sendResetPasswordEmail(user.email, user.name, url);
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      void sendVerificationEmail(user.email, user.name, url);
    },
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  user: {
    additionalFields: {
      isAcceptingMessage: {
        type: "boolean",
        required: false,
        defaultValue: true,
        input: true, // it's the user's own preference, so they may change it
      },
    },
  },

  plugins: [username()],
});
