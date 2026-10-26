import { z } from "zod";

export const signInSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, { message: "Enter your email or username" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const forgotPasswordSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});
