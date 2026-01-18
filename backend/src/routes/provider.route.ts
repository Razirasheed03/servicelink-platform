import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth } from "../http/auth.middleware";
import { subscriptionController } from "../dependencies/subscription.di";

const router = Router();

// Provider subscribes/renews via Stripe Checkout
router.post(
  "/subscribe",
  requireAuth,
  asyncHandler(subscriptionController.createCheckoutSession)
);

// Provider subscription status
router.get(
  "/subscription-status",
  requireAuth,
  asyncHandler(subscriptionController.getSubscriptionStatus)
);

export default router;
