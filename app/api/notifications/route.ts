import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Notification } from "@/models/Notification";

export async function GET() {
  await connectDB();
  const notifications = await Notification.find().sort({
    createdAt: -1,
  });
  return NextResponse.json(notifications);
}
