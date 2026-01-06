import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth } from "../http/auth.middleware";
import { userController } from "../dependencies/user.di";

const router = Router();

router.get("/profile", requireAuth, asyncHandler(userController.getProfile));
router.put("/update", requireAuth, asyncHandler(userController.updateProfile));
router.get("/providers", requireAuth, asyncHandler(userController.listProviders));
router.get("/providers/:id", requireAuth, asyncHandler(userController.getProviderById));

router.post("/provider/reapply-verification", requireAuth, asyncHandler(userController.reapplyVerification));

export default router;