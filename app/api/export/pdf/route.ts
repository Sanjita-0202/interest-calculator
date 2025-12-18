export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Transaction  from "../../../../models/Transactions";
import path from "path";
import { PassThrough } from "stream";

const PDFKit = require("pdfkit");
const PDFDocument = PDFKit.default || PDFKit;

/* ----------------- CHART HELPER ----------------- */
function drawBarChart(
  doc: any,
  {
    x,
    y,
    width,
    height,
    data,
    labels,
    colors,
    title,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
    data: number[];
    labels: string[];
    colors: string[];
    title: string;
  }
) {
  const max = Math.max(...data, 1);
  const barWidth = width / data.length - 12;

  doc.fontSize(12).fillColor("black").text(title, x, y - 20);

  data.forEach((value, i) => {
    const barHeight = (value / max) * height;
    const barX = x + i * (barWidth + 12);
    const barY = y + height - barHeight;

    doc
      .fillColor(colors[i])
      .rect(barX, barY, barWidth, barHeight)
      .fill();

    doc
      .fillColor("black")
      .fontSize(9)
      .text(labels[i], barX, y + height + 5, {
        width: barWidth,
        align: "center",
      });

    doc
      .fontSize(9)
      .text(`₹${value}`, barX, barY - 12, {
        width: barWidth,
        align: "center",
      });
  });
}

/* ----------------- API ROUTE ----------------- */
export async function GET(req: Request) {
  try {
    await connectDB();

    /* -------- DATE RANGE -------- */
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const dateFilter: any = {};
    if (from) dateFilter.$gte = new Date(from);
    if (to) dateFilter.$lte = new Date(to);

    const query = Object.keys(dateFilter).length
      ? { date: dateFilter }
      : {};

    const transactions = await Transaction.find(query)
      .populate("accountId")
      .sort({ date: -1 });

    /* -------- TOTALS -------- */
    let totalGiven = 0;
    let totalTaken = 0;

    transactions.forEach((t: any) => {
      if (t.givenOrTaken === "Given") totalGiven += t.amount;
      else totalTaken += t.amount;
    });

    const outstanding = totalGiven - totalTaken;

    /* -------- MONTHLY AGG -------- */
    const monthlyMap: Record<string, number> = {};
    transactions.forEach((t: any) => {
      const d = new Date(t.date);
      const key = `${d.getMonth() + 1}/${d.getFullYear()}`;
      monthlyMap[key] = (monthlyMap[key] || 0) + t.amount;
    });

    const months = Object.keys(monthlyMap).slice(0, 6);
    const monthValues = months.map((m) => monthlyMap[m]);

    /* -------- PDF SETUP -------- */
    const fontPath = path.join(
      process.cwd(),
      "public",
      "fonts",
      "Roboto-Regular.ttf"
    );

    const stream = new PassThrough();
    const chunks: Buffer[] = [];
    stream.on("data", (c) => chunks.push(c));

    const doc = new PDFDocument({
      margin: 40,
      font: fontPath, // 🔥 prevents Helvetica issue
    });

    doc.pipe(stream);

    /* ================= PAGE 1: SUMMARY ================= */
    doc.fontSize(20).text("Interest Calculator Report", {
      align: "center",
    });

    doc.moveDown(2);
    doc.fontSize(12);
    doc.text(`Date Range: ${from ?? "Beginning"} → ${to ?? "Today"}`);
    doc.moveDown();

    doc.text(`Total Given: ₹ ${totalGiven}`);
    doc.text(`Total Taken: ₹ ${totalTaken}`);
    doc.text(`Outstanding: ₹ ${outstanding}`);

    /* ================= PAGE 2: CHARTS ================= */
    doc.addPage();

    drawBarChart(doc, {
      x: 50,
      y: 100,
      width: 220,
      height: 150,
      data: [totalGiven, totalTaken],
      labels: ["Given", "Taken"],
      colors: ["#2563eb", "#dc2626"],
      title: "Given vs Taken",
    });

    drawBarChart(doc, {
      x: 50,
      y: 330,
      width: 500,
      height: 180,
      data: monthValues,
      labels: months,
      colors: months.map(() => "#16a34a"),
      title: "Monthly Totals",
    });

    /* ================= PAGE 3+: TABLE ================= */
    doc.addPage();

    let y = 60;
    const startX = 40;
    const col = {
      no: startX,
      name: startX + 40,
      type: startX + 220,
      amount: startX + 310,
      date: startX + 410,
    };

    doc.fontSize(11);
    doc.text("No", col.no, y);
    doc.text("Name", col.name, y);
    doc.text("Type", col.type, y);
    doc.text("Amount", col.amount, y);
    doc.text("Date", col.date, y);

    y += 15;
    doc.moveTo(startX, y).lineTo(550, y).stroke();
    y += 10;

    transactions.forEach((tx: any, i: number) => {
      if (y > 750) {
        doc.addPage();
        y = 60;
      }

      doc.text(i + 1, col.no, y);
      doc.text(tx.accountId?.name ?? "Unknown", col.name, y);
      doc.text(tx.givenOrTaken, col.type, y);
      doc.text(`₹ ${tx.amount}`, col.amount, y);
      doc.text(
        tx.date ? new Date(tx.date).toDateString() : "-",
        col.date,
        y
      );

      y += 18;
    });

    doc.end();

    await new Promise<void>((resolve) => stream.on("end", resolve));

    const pdfBuffer = Buffer.concat(chunks);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="report.pdf"',
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (err: any) {
    console.error("PDF EXPORT ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
