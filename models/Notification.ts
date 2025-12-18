import { Schema, model, models } from "mongoose";

const NotificationSchema = new Schema(
  {
    userId: String, // future auth
    title: String,
    message: String,
    type: {
      type: String,
      enum: ["info", "warning", "danger"],
      default: "info",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Notification =
  models.Notification || model("Notification", NotificationSchema);
