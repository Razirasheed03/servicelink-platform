"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../utils/asyncHandler");
const subscription_di_1 = require("../dependencies/subscription.di");
// We intentionally use express.Router without express.json; server mounts this with express.raw for signature verification
const router = express_1.default.Router();
router.post("/webhook", (0, asyncHandler_1.asyncHandler)(subscription_di_1.subscriptionController.handleStripeWebhook));
exports.default = router;
