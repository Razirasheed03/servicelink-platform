import { Router } from "express";
import { requireAuth } from "../http/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { reviewController } from "../dependencies/review.di";

const router = Router();

router.post("/", requireAuth, asyncHandler(reviewController.createReview));

// Provider-only
router.get("/provider/dashboard", requireAuth, asyncHandler(reviewController.getProviderDashboard));
router.get("/provider/me", requireAuth, asyncHandler(reviewController.getMyProviderReviews));

// User-only
router.patch("/:reviewId", requireAuth, asyncHandler(reviewController.editReview));

// Provider reply
router.patch("/:reviewId/reply", requireAuth, asyncHandler(reviewController.replyToReview));

router.get("/:providerId", requireAuth, asyncHandler(reviewController.getProviderReviews));

export default router;
    