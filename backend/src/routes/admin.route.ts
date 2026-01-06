import { Router } from "express";
import { requireAuth } from "../http/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { adminController } from "../dependencies/admin.di";

const router = Router();

router.get("/dashboard", requireAuth, asyncHandler(adminController.getDashboard));

router.get("/providers", requireAuth, asyncHandler(adminController.listProviders));
router.get("/providers/:providerId", requireAuth, asyncHandler(adminController.getProviderById));
router.get("/users", requireAuth, asyncHandler(adminController.listUsers));

router.patch("/providers/:providerId/approve", requireAuth, asyncHandler(adminController.approveProvider));
router.patch("/providers/:providerId/reject", requireAuth, asyncHandler(adminController.rejectProvider));

router.patch("/users/:userId/block", requireAuth, asyncHandler(adminController.setUserBlocked));
router.patch("/providers/:providerId/block", requireAuth, asyncHandler(adminController.setProviderBlocked));

export default router;
