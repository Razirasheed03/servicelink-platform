import { Schema, model } from "mongoose";
import { ISubscriptionModel } from "../models/interfaces/subscription.model.interface";
import { PaymentStatus } from "../constants/subscription";

const SubscriptionSchema = new Schema<ISubscriptionModel>(
  {
    providerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      required: true,
    },
    stripeSessionId: { type: String, required: true, unique: true },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    paidAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Subscription = model<ISubscriptionModel>("Subscription", SubscriptionSchema);
