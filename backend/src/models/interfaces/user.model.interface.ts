import { Document } from "mongoose";
import { UserRole } from "../../constants/roles";
import { SubscriptionStatus } from "../../constants/subscription";


export interface IUserModel extends Document {
  username: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
  serviceType?: string;
  location?: string;
  experience?: number;
	consultationFee?: number;
  isBlocked?: boolean;
	isVerified?: boolean;
	verificationStatus?: "pending" | "approved" | "rejected";
	verificationReason?: string;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionStartDate?: Date | null;
  subscriptionEndDate?: Date | null;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}