import { connectDB } from "@/lib/db";
import { Account } from "@/models/Accounts";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const accounts = await Account.find();
  const data = accounts.map(acc => ({
    name: acc.name,
    outstanding: acc.totalOutstanding,
    given: acc.totalGiven,
    taken: acc.totalTaken,
  }));

  return NextResponse.json(data);
}
