import { connectDB } from "@/lib/db";
import Transaction from "@/models/Transactions";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const txs = await Transaction.find();
  const data = txs.map(tx => ({
    title: tx.title,
    principal: tx.amount,
    interest: (tx.amount * tx.interestRate) / 100,
  }));

  return NextResponse.json(data);
}
