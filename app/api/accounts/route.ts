import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Account } from "@/models/Accounts";

/* ---------------- CREATE ACCOUNT ---------------- */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, contact } = body;

    if (!name || !contact) {
      return NextResponse.json(
        { success: false, message: "Name and contact are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const account = await Account.create({
      name,
      contact,
    });

    return NextResponse.json(
      { success: true, data: account },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to create account" },
      { status: 500 }
    );
  }
}

/* ---------------- GET ALL ACCOUNTS ---------------- */
export async function GET() {
  try {
    await connectDB();

    const accounts = await Account.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: accounts },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch accounts" },
      { status: 500 }
    );
  }
}
