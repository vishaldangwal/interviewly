import { sendScheduledEmail } from "@/lib/SendVerificationMail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, title, email, date, time, type } = body;

    if (!name || !title || !email || !date || !time || !type) {
      throw new Error("Missing required fields");
    }

    const emailResponse = await sendScheduledEmail(
      name,
      title,
      email,
      date,
      time,
      type,
    );

    if (!emailResponse.success) {
      throw new Error("Failed to send verification email");
    }

    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error: any) {
    console.error("Error in /api/send-email:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
