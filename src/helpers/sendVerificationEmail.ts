import { resend } from "@/src/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/src/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verificationUrl: string,
): Promise<ApiResponse> {
  try {
    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify your email address",
      react: VerificationEmail({ username, verificationUrl }),
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, message: "Failed to send verification email." };
    }

    return {
      success: true,
      message: "Verification email sent successfully.",
    };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return { success: false, message: "Failed to send verification email." };
  }
}
