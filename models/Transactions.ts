import { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true, 
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    contactPhone: {
      type: String,
      trim: true,
    },

    contactEmail: {
      type: String,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    interestRate: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ["given", "taken"],
      required: true,
    },

    paymentMode: {
      type: String,
      enum: ["cash", "upi", "bank", "cheque"],
      required: true,
    },

    proofImage: {
      type: String,
    },

    date: {
      type: Date,
      required: true,
    },

    isPartialPayment: {
  type: Boolean,
  default: false,
},

remainingPrincipal: {
  type: Number,
},

interestStartDate: {
  type: Date,
  required: true,
},
dueDate: {
  type: Date,
  required: true,
},

status: {
  type: String,
  enum: ["active", "paid", "overdue"],
  default: "active",
},


  },
  { timestamps: true }
);

export default models.Transaction ||
  model("Transaction", TransactionSchema);
