import express from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { subscriptionController } from "../dependencies/subscription.di";

const router = express.Router();

router.post(
  "/webhook",
  asyncHandler(subscriptionController.handleStripeWebhook)
);

export default router;
