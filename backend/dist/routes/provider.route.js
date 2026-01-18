"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../utils/asyncHandler");
const auth_middleware_1 = require("../http/auth.middleware");
const subscription_di_1 = require("../dependencies/subscription.di");
const router = (0, express_1.Router)();
// Provider subscribes/renews via Stripe Checkout
router.post("/subscribe", auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(subscription_di_1.subscriptionController.createCheckoutSession));
// Provider subscription status
router.get("/subscription-status", auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(subscription_di_1.subscriptionController.getSubscriptionStatus));
exports.default = router;
