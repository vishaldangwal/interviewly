import { sendJobApplicationEmail } from "@/lib/SendJobNotificationMail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      recipientName, 
      recipientEmail, 
      jobTitle, 
      companyName, 
      applicantName, 
      applicationDate, 
      applicationType, 
      oldStatus, 
      newStatus, 
      notes 
    } = body;

    if (!recipientName || !recipientEmail || !jobTitle || !companyName || !applicantName || !applicationDate || !applicationType) {
      throw new Error("Missing required fields");
    }

    const emailResponse = await sendJobApplicationEmail(
      recipientName,
      recipientEmail,
      jobTitle,
      companyName,
      applicantName,
      applicationDate,
      applicationType,
      oldStatus,
      newStatus,
      notes,
    );

    if (!emailResponse.success) {
      throw new Error("Failed to send job notification email");
    }

    return NextResponse.json({
      success: true,
      message: "Job notification email sent successfully",
    });
  } catch (error: any) {
    console.error("Error in /api/send-job-notification:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 },
    );
  }
} 