import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmailTemplate";
import { ApiResponse } from "@/types/ApiRespose";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystry Messenger | Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "Verification Code sent successfully!" };
  } catch (error) {
    console.error("Failed to send verification code!", error);
    return { success: false, message: "Failed to send Verification Code" };
  }
}
