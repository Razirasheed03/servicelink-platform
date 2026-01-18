import { Document, Types } from "mongoose";
import { PaymentStatus } from "../../constants/subscription";

export interface ISubscriptionModel extends Document {
  providerId: Types.ObjectId;
  amount: number;
  paymentStatus: PaymentStatus;
  stripeSessionId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  paidAt?: Date | null;
  expiresAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
