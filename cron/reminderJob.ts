import cron from "node-cron";
import { connectDB } from "@/lib/db";
import Transaction from "@/models/Transactions";
import { Notification } from "@/models/Notification";
import { getReminderType } from "@/lib/reminderEngine";

cron.schedule("0 9 * * *", async () => {
  await connectDB();

  const transactions = await Transaction.find({
    status: { $in: ["active", "overdue"] },
  });

  for (const tx of transactions) {
    const reminderType = getReminderType(tx.dueDate);
    if (!reminderType) continue;

    let title = "";
    let message = "";
    let type: "info" | "warning" | "danger" = "info";

    if (reminderType === "UPCOMING_3_DAYS") {
      title = "Upcoming Payment";
      message = `${tx.title} is due in 3 days`;
    }

    if (reminderType === "DUE_TODAY") {
      title = "Payment Due Today";
      message = `${tx.title} is due today`;
      type = "warning";
    }

    if (reminderType === "OVERDUE") {
      title = "Payment Overdue";
      message = `${tx.title} is overdue`;
      type = "danger";
      tx.status = "overdue";
      await tx.save();
    }

    await Notification.create({ title, message, type });
  }
});
