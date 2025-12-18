import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Account } from "@/models/Accounts";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const account = await Account.findById(params.id);
  if (!account) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
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
}
