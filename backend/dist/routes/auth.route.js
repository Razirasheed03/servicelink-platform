"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../utils/asyncHandler");
const auth_di_1 = require("../dependencies/auth.di");
const router = (0, express_1.Router)();
router.post("/signup", (0, asyncHandler_1.asyncHandler)(auth_di_1.authController.signup));
router.post("/verify-otp", (0, asyncHandler_1.asyncHandler)(auth_di_1.authController.verifyOtp));
router.post("/resend-otp", (0, asyncHandler_1.asyncHandler)(auth_di_1.authController.resendOtp));
router.post("/login", (0, asyncHandler_1.asyncHandler)(auth_di_1.authController.login));
router.post("/forgot-password", (0, asyncHandler_1.asyncHandler)(auth_di_1.authController.forgotPassword));
router.post("/reset-password", (0, asyncHandler_1.asyncHandler)(auth_di_1.authController.resetPassword));
router.post("/google/login", (0, asyncHandler_1.asyncHandler)(auth_di_1.authController.googleLoginWithToken));
router.post("/refresh-token", (0, asyncHandler_1.asyncHandler)(auth_di_1.authController.refreshToken));
// OPTIONAL redirect-based OAuth:
router.get("/google", (0, asyncHandler_1.asyncHandler)(auth_di_1.authController.googleRedirect));
router.get("/google/callback", (0, asyncHandler_1.asyncHandler)(auth_di_1.authController.googleCallback));
exports.default = router;
