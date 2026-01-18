import { SubscriptionStatus } from "../../constants/subscription";

export interface SubscriptionStatusResponse {
  status: SubscriptionStatus;
  startDate: Date | null;
  endDate: Date | null;
  message?: string;
}

export interface ISubscriptionService {
  createCheckoutSession(providerUserId: string): Promise<{ checkoutUrl: string; sessionId: string }>;
  getSubscriptionStatus(providerUserId: string): Promise<SubscriptionStatusResponse>;
  handleStripeWebhook(signature: string | undefined, rawBody: Buffer): Promise<void>;
}
