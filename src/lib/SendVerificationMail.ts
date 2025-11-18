import { resend } from "./resend";

import EmailTemplate from "../../emails/interview-scheduling";
export async function sendScheduledEmail(
  candidateName: string,
  position: string,
  email: string,
  interviewDate: string,
  interviewTime: string,
  interviewFormat: string,
): Promise<any> {
  try {
    //console.log("Email", email);
    await resend.emails.send({
      from: "admin@priyanshubhardwaj.site",
      to: email,
      subject: "Interview Scheduled Successfully",
      react: EmailTemplate({
        candidateName,
        position,
        interviewDate,
        interviewTime,
        interviewFormat,
      }),
    });
    return {
      success: true,
      message: "Verification email sent",
    };
  } catch (emailError) {
    //console.log(emailError);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
