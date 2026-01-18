import express from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { subscriptionController } from "../dependencies/subscription.di";

// We intentionally use express.Router without express.json; server mounts this with express.raw for signature verification
const router = express.Router();

router.post(
  "/webhook",
  asyncHandler(subscriptionController.handleStripeWebhook)
);

export default router;
