"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../http/auth.middleware");
const asyncHandler_1 = require("../utils/asyncHandler");
const review_di_1 = require("../dependencies/review.di");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(review_di_1.reviewController.createReview));
// Provider-only
router.get("/provider/dashboard", auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(review_di_1.reviewController.getProviderDashboard));
router.get("/provider/me", auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(review_di_1.reviewController.getMyProviderReviews));
// User-only
router.patch("/:reviewId", auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(review_di_1.reviewController.editReview));
// Provider reply
router.patch("/:reviewId/reply", auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(review_di_1.reviewController.replyToReview));
router.get("/:providerId", auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(review_di_1.reviewController.getProviderReviews));
exports.default = router;
