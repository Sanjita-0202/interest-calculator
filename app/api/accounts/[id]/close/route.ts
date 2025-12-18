import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Account } from "@/models/Accounts";

export async function POST(
  request: any,
  context: any
) {
  try {
    await connectDB();

    const id = context?.params?.id;

    if (!id) {
      return NextResponse.json(
        { error: "Missing account id" },
        { status: 400 }
      );
    }

    const account = await Account.findById(id);

    if (!account) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    if (account.totalOutstanding !== 0) {
      return NextResponse.json(
        { error: "Outstanding must be zero to close account" },
        { status: 400 }
      );
    }

    account.closed = true;
    await account.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to close account" },
      { status: 500 }
    );
  }
}
