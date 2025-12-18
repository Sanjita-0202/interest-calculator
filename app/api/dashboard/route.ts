import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { Account } from "../../../models/Accounts";
import Transaction from "../../../models/Transactions";
import { calculateInterest } from "@/lib/interest";

export async function GET() {
  try {
    await connectDB();

    /* ---------------- ACCOUNT TOTALS ---------------- */
    const accountStats = await Account.aggregate([
      {
        $group: {
          _id: null,
          totalGiven: { $sum: "$totalGiven" },
          totalTaken: { $sum: "$totalTaken" },
          totalOutstanding: { $sum: "$totalOutstanding" },
          accountsCount: { $sum: 1 },
        },
      },
    ]);

    /* ---------------- TRANSACTION COUNT ---------------- */
    const transactionsCount = await Transaction.countDocuments();

    /* ---------------- RECENT TRANSACTIONS ---------------- */
    const recentTransactions = await Transaction.find()
      .populate("accountId", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    /* ---------------- TOTAL INTEREST (SI + CI) ---------------- */
    let totalInterest = 0;

    const allTransactions = await Transaction.find();

    allTransactions.forEach((tx: any) => {
      if (!tx.interestRate || !tx.startDate) return;

      const interest = calculateInterest({
        principal: tx.amount,
        interestRate: tx.interestRate,
        interestType: tx.interestType,
        compounding: tx.compounding,
        startDate: tx.startDate,
        endDate: new Date(),
      });

      totalInterest += interest;
    });

    /* ---------------- MONTHLY TRANSACTION TOTALS ---------------- */
    const monthlyStats = await Transaction.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalAmount: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    /* ---------------- GIVEN VS TAKEN ---------------- */
    const givenTakenStats = await Transaction.aggregate([
      {
        $group: {
          _id: "$givenOrTaken",
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    /* ---------------- RESPONSE ---------------- */
    return NextResponse.json({
      success: true,
      data: {
        totals: {
          ...(accountStats[0] || {
            totalGiven: 0,
            totalTaken: 0,
            totalOutstanding: 0,
            accountsCount: 0,
          }),
          totalInterest,
        },
        transactionsCount,
        recentTransactions,
        charts: {
          monthlyStats,
          givenTakenStats,
        },
      },
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load dashboard" },
      { status: 500 }
    );
  }
}
