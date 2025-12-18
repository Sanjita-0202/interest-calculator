import { NextResponse } from "next/server";

/**
 * Placeholder reminders endpoint
 * (Future: email / SMS / WhatsApp integration)
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Reminder system initialized",
  });
}
