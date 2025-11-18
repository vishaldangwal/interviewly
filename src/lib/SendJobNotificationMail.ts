import { resend } from "./resend";
import JobApplicationNotification from "../../emails/job-application-notification";

export async function sendJobApplicationEmail(
  recipientName: string,
  recipientEmail: string,
  jobTitle: string,
  companyName: string,
  applicantName: string,
  applicationDate: string,
  applicationType: "new_application" | "status_update",
  oldStatus?: string,
  newStatus?: string,
  notes?: string,
): Promise<any> {
  try {
    await resend.emails.send({
      from: "admin@priyanshubhardwaj.site",
      to: recipientEmail,
      subject: applicationType === "new_application" 
        ? `New Application for ${jobTitle} at ${companyName}`
        : `Application Status Updated - ${jobTitle} at ${companyName}`,
      react: JobApplicationNotification({
        recipientName,
        jobTitle,
        companyName,
        applicantName,
        applicationDate,
        applicationType,
        oldStatus,
        newStatus,
        notes,
      }),
    });
    
    return {
      success: true,
      message: "Job application notification email sent successfully",
    };
  } catch (emailError) {
    console.error("Failed to send job application email:", emailError);
    return {
      success: false,
      message: "Failed to send job application notification email",
    };
  }
} 