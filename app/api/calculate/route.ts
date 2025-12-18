import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Calculation } from "@/models/Calculation";

export async function POST(req: Request) {
  try {
    await connectDB();

    const {
      accountId,
      principal,
      interestRate,
      interestType,
      compounding,
      startDate,
      endDate,
      interest,
      totalAmount,
    } = await req.json();

    if (
      !accountId ||
      !principal ||
      !interestRate ||
      !interestType ||
      !startDate ||
      !endDate ||
      interest === undefined ||
      totalAmount === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const calculation = await Calculation.create({
      accountId,
      principal,
      interestRate,
      interestType,
      compounding: interestType === "compound" ? compounding : undefined,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      interest,
      totalAmount,
    });

    return NextResponse.json(calculation, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save calculation" },
      { status: 500 }
    );
  }
}
