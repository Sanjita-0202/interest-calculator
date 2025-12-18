import { Schema, model, models } from "mongoose";

const AccountSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    contact: {
      type: String,
      required: true,
      trim: true,
    },

    totalGiven: {
      type: Number,
      default: 0,
    },

    totalTaken: {
      type: Number,
      default: 0,
    },

    totalOutstanding: {
      type: Number,
      default: 0,
    },

    // ✅ ADD THIS FIELD
    closed: {
      type: Boolean,
      default: false,
    },
    defaultInterestType: {
  type: String,
  enum: ["simple", "compound"],
  default: "simple",
},

defaultInterestRate: {
  type: Number,
  default: 0,
},

dueDate: Date,

penaltyRate: {
  type: Number,
  default: 0,
},

  },
  { timestamps: true }
);

export const Account =
  models.Account || model("Account", AccountSchema);
