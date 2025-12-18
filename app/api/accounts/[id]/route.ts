import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Account } from "@/models/Accounts";

/* -------- UPDATE ACCOUNT -------- */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await req.json();

    const account = await Account.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );

    if (!account) {
      return NextResponse.json(
        { success: false, message: "Account not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: account },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update account" },
      { status: 500 }
    );
  }
}

/* -------- DELETE ACCOUNT -------- */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const account = await Account.findByIdAndDelete(params.id);

    if (!account) {
      return NextResponse.json(
        { success: false, message: "Account not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete account" },
      { status: 500 }
    );
  }
}
