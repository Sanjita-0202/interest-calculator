import { Account } from "@/models/Accounts";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { connectDB } from "../../../../lib/db";
import  Transaction  from "../../../../models/Transactions";
export async function GET() {
  await connectDB();

  const transactions = await Transaction.find()
    .populate("accountId", "name")
    .sort({ date: -1 });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Transactions");

  sheet.columns = [
    { header: "Date", key: "date", width: 15 },
    { header: "Account", key: "account", width: 25 },
    { header: "Type", key: "type", width: 10 },
    { header: "Amount", key: "amount", width: 15 },
    { header: "Interest Rate", key: "rate", width: 15 },
    { header: "Interest Type", key: "interestType", width: 15 },
  ];

  transactions.forEach((tx: any) => {
    sheet.addRow({
      date: tx.date.toISOString().split("T")[0],
      account: tx.accountId?.name,
      type: tx.givenOrTaken,
      amount: tx.amount,
      rate: tx.interestRate,
      interestType: tx.interestType,
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="transactions.xlsx"',
    },
  });
}
