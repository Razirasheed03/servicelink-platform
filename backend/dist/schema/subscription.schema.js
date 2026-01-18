"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
const mongoose_1 = require("mongoose");
const subscription_1 = require("../constants/subscription");
const SubscriptionSchema = new mongoose_1.Schema({
    providerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true },
    paymentStatus: {
        type: String,
        enum: Object.values(subscription_1.PaymentStatus),
        default: subscription_1.PaymentStatus.PENDING,
        required: true,
    },
    stripeSessionId: { type: String, required: true, unique: true },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    paidAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
}, { timestamps: true });
exports.Subscription = (0, mongoose_1.model)("Subscription", SubscriptionSchema);
