import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Account } from "@/models/Accounts";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await context.params;

  const account = await Account.findById(id);

  if (!account) {
    return NextResponse.json(
      { error: "Account not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: account });
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await context.params;
  const body = await req.json();

  const account = await Account.findByIdAndUpdate(id, body, { new: true });

  return NextResponse.json({ data: account });
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await context.params;

  await Account.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
