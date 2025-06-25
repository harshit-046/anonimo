import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: "Account Verification",
            react: VerificationEmail({username,otp:verifyCode}),
        });
        return {
            success: true,
            message: "Verification Code Send Successfully"
        }
    } catch (emailError) {
        console.error("Error Sending Verification Email", emailError)
        return {
            success: false,
            message: "Failed to sent Verification email"
        }
    }
}