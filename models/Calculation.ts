import mongoose, { Schema, model, models } from "mongoose";

const CalculationSchema = new Schema(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },

    principal: {
      type: Number,
      required: true,
    },

    interestRate: {
      type: Number,
      required: true,
    },

    interestType: {
      type: String,
      enum: ["simple", "compound"],
      required: true,
    },

    compounding: {
      type: String,
      enum: ["monthly", "quarterly", "yearly"],
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    interest: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Calculation =
  models.Calculation || model("Calculation", CalculationSchema);
