import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { authController } from "../dependencies/auth.di";

const router = Router();

router.post("/signup", asyncHandler(authController.signup));
router.post("/verify-otp", asyncHandler(authController.verifyOtp));
router.post("/resend-otp", asyncHandler(authController.resendOtp));
router.post("/login", asyncHandler(authController.login));
router.post("/forgot-password", asyncHandler(authController.forgotPassword));
router.post("/reset-password", asyncHandler(authController.resetPassword));
router.post("/google/login", asyncHandler(authController.googleLoginWithToken));
router.post("/refresh-token", asyncHandler(authController.refreshToken));
// OPTIONAL redirect-based OAuth:
router.get("/google", asyncHandler(authController.googleRedirect));
router.get("/google/callback", asyncHandler(authController.googleCallback));
export default router;