import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Transaction from "@/models/Transactions";
import { Account } from "@/models/Accounts";
import mongoose from "mongoose";

/* ---------------- CREATE TRANSACTION ---------------- */
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      accountId,
      title,
      amount,
      interestRate,
      type,
      paymentMode,
      date,
      dueDate,
      description,
      contactPhone,
      contactEmail,
    } = body;

    // 🔒 Validation
    if (
      !accountId ||
      !mongoose.Types.ObjectId.isValid(accountId) ||
      !title ||
      !amount ||
      !interestRate ||
      !type ||
      !paymentMode ||
      !date
    ) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    const account = await Account.findById(accountId);
    if (!account) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    // 🔒 Block transactions on closed accounts
    if (account.closed) {
      return NextResponse.json(
        { error: "Account is closed. No new transactions allowed." },
        { status: 400 }
      );
    }

    // ✅ Create transaction
    const transaction = await Transaction.create({
      accountId,
      title,
      amount,
      interestRate,
      type,
      paymentMode,
      date,
      dueDate,
      description,
      contactPhone,
      contactEmail,
    });

    // 🔄 AUTO-SYNC ACCOUNT TOTALS
    if (type === "given") {
      account.totalGiven += amount;
      account.totalOutstanding += amount;
    } else {
      account.totalTaken += amount;
      account.totalOutstanding -= amount;
    }

    await account.save();

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("TRANSACTION POST ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

/* ---------------- GET TRANSACTIONS ---------------- */
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const accountId = searchParams.get("accountId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "date";
    const order = searchParams.get("order") === "asc" ? 1 : -1;

    const filter: any = {};

    if (accountId && mongoose.Types.ObjectId.isValid(accountId)) {
      filter.accountId = accountId;
    }

    if (from && to) {
      filter.date = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const transactions = await Transaction.find(filter)
      .populate("accountId", "name contact")
      .sort({ [sortBy]: order });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("TRANSACTION GET ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
