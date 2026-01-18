export enum SubscriptionStatus {
  PENDING_APPROVAL = "PENDING_APPROVAL",
  APPROVED_BUT_UNSUBSCRIBED = "APPROVED_BUT_UNSUBSCRIBED",
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}
