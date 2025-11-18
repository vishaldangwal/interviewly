export async function sendActivityEmail(activityData: {
  user: { name: string; email: string } | null;
  metadata: any;
  type: string;
}) {
  if (!activityData.user || !activityData.user.email) {
    console.log("No user email found for activity notification");
    return { success: false, message: "No user email found" };
  }

  // Determine email type and content
  let applicationType: "new_application" | "status_update" = "new_application";
  let oldStatus = "";
  let newStatus = "";

  if (activityData.type === "application_submitted") {
    applicationType = "new_application";
  } else if (["application_reviewed", "application_shortlisted", "application_rejected", "application_hired"].includes(activityData.type)) {
    applicationType = "status_update";
    oldStatus = activityData.metadata?.oldStatus || "";
    newStatus = activityData.metadata?.newStatus || "";
  }

  try {
    const response = await fetch("/api/send-job-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipientName: activityData.user.name,
        recipientEmail: activityData.user.email,
        jobTitle: activityData.metadata?.jobTitle || "Unknown Job",
        companyName: activityData.metadata?.companyName || "Unknown Company",
        applicantName: activityData.metadata?.applicantName || "Unknown Applicant",
        applicationDate: new Date().toLocaleDateString(),
        applicationType,
        oldStatus,
        newStatus,
        notes: activityData.metadata?.notes || "",
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to send activity email:", error);
    return { success: false, message: "Failed to send email notification" };
  }
} 