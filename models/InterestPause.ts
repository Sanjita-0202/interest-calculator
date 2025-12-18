import { Schema, model, models } from "mongoose";

const InterestPauseSchema = new Schema({
  transactionId: {
    type: Schema.Types.ObjectId,
    ref: "Transaction",
    required: true,
  },
  from: Date,
  to: Date,
  reason: String,
});

export const InterestPause =
  models.InterestPause || model("InterestPause", InterestPauseSchema);
