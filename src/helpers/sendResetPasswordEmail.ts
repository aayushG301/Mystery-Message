import { resend } from "@/src/lib/resend";
import ResetPasswordEmail from "../../emails/ResetPasswordEmail";
import type { ApiResponse } from "@/src/types/ApiResponse";

export async function sendResetPasswordEmail(
  email: string,
  username: string,
  resetUrl: string,
): Promise<ApiResponse> {
  try {
    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev", // replace with your verified domain in production
      to: email,
      subject: "Reset your password",
      react: ResetPasswordEmail({ username, resetUrl }),
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, message: "Failed to send reset email." };
    }
    return { success: true, message: "Reset email sent." };
  } catch (emailError) {
    console.error("Error sending reset email:", emailError);
    return { success: false, message: "Failed to send reset email." };
  }
}
