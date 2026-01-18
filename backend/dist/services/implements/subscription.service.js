"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const env_1 = require("../../config/env");
const subscription_1 = require("../../constants/subscription");
const errors_1 = require("../../http/errors");
const SUBSCRIPTION_DURATION_DAYS = 30;
const SUBSCRIPTION_AMOUNT = 199; // INR 199 per month
class SubscriptionService {
    constructor(userRepo, subscriptionRepo) {
        this.userRepo = userRepo;
        this.subscriptionRepo = subscriptionRepo;
        this.stripe = new stripe_1.default(env_1.env.STRIPE_SECRET_KEY, {
            apiVersion: "2025-10-29.clover",
        });
    }
    createCheckoutSession(providerUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this.userRepo.findProviderById(providerUserId);
            if (!provider)
                throw new errors_1.AppError(404, "NOT_FOUND", "Provider not found");
            if (provider.isBlocked)
                throw new errors_1.AppError(403, "FORBIDDEN", "Blocked providers cannot subscribe");
            if (!provider.isVerified || provider.verificationStatus !== "approved") {
                throw new errors_1.ValidationAppError("Provider must be approved by admin before subscribing");
            }
            // Guard active subscription
            if (provider.subscriptionStatus === subscription_1.SubscriptionStatus.ACTIVE &&
                provider.subscriptionEndDate &&
                provider.subscriptionEndDate > new Date()) {
                throw new errors_1.ValidationAppError("Subscription already active");
            }
            // Ensure stripe customer
            let customerId = provider.stripeCustomerId;
            if (!customerId) {
                const customer = yield this.stripe.customers.create({
                    email: provider.email,
                    name: provider.username,
                    metadata: { providerId: providerUserId },
                });
                customerId = customer.id;
                yield this.userRepo.updateByIdWithSubscription(providerUserId, {
                    stripeCustomerId: customerId,
                });
            }
            const session = yield this.stripe.checkout.sessions.create({
                mode: "subscription",
                customer: customerId,
                line_items: [
                    {
                        price: env_1.env.STRIPE_PROVIDER_PRICE_ID,
                        quantity: 1,
                    },
                ],
                success_url: `${env_1.env.FRONTEND_URL}/provider/home?payment=success`,
                cancel_url: `${env_1.env.FRONTEND_URL}/provider/home?payment=cancelled`,
                metadata: {
                    providerId: providerUserId,
                },
            });
            // Record pending subscription
            yield this.subscriptionRepo.create({
                providerId: provider._id,
                amount: SUBSCRIPTION_AMOUNT,
                paymentStatus: subscription_1.PaymentStatus.PENDING,
                stripeSessionId: session.id,
                stripeCustomerId: customerId,
                stripeSubscriptionId: session.subscription || undefined,
                paidAt: null,
                expiresAt: null,
            });
            yield this.userRepo.updateByIdWithSubscription(providerUserId, {
                subscriptionStatus: subscription_1.SubscriptionStatus.APPROVED_BUT_UNSUBSCRIBED,
            });
            return { checkoutUrl: session.url, sessionId: session.id };
        });
    }
    getSubscriptionStatus(providerUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const provider = yield this.userRepo.findProviderById(providerUserId);
            if (!provider)
                throw new errors_1.AppError(404, "NOT_FOUND", "Provider not found");
            // Auto-expire if needed
            if (provider.subscriptionStatus === subscription_1.SubscriptionStatus.ACTIVE &&
                provider.subscriptionEndDate &&
                provider.subscriptionEndDate <= new Date()) {
                const updated = yield this.userRepo.updateByIdWithSubscription(providerUserId, {
                    subscriptionStatus: subscription_1.SubscriptionStatus.EXPIRED,
                });
                return {
                    status: subscription_1.SubscriptionStatus.EXPIRED,
                    startDate: (_a = updated === null || updated === void 0 ? void 0 : updated.subscriptionStartDate) !== null && _a !== void 0 ? _a : null,
                    endDate: (_c = (_b = updated === null || updated === void 0 ? void 0 : updated.subscriptionEndDate) !== null && _b !== void 0 ? _b : provider.subscriptionEndDate) !== null && _c !== void 0 ? _c : null,
                    message: "Subscription expired. Please renew.",
                };
            }
            return {
                status: provider.subscriptionStatus || subscription_1.SubscriptionStatus.PENDING_APPROVAL,
                startDate: (_d = provider.subscriptionStartDate) !== null && _d !== void 0 ? _d : null,
                endDate: (_e = provider.subscriptionEndDate) !== null && _e !== void 0 ? _e : null,
                message: provider.subscriptionStatus === subscription_1.SubscriptionStatus.EXPIRED
                    ? "Subscription expired. Please renew."
                    : undefined,
            };
        });
    }
    handleStripeWebhook(signature, rawBody) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            if (!signature)
                throw new errors_1.AppError(400, "BAD_REQUEST", "Missing Stripe signature");
            let event;
            try {
                event = this.stripe.webhooks.constructEvent(rawBody, signature, env_1.env.STRIPE_WEBHOOK_SECRET);
            }
            catch (err) {
                console.error("Stripe webhook signature verification failed", err === null || err === void 0 ? void 0 : err.message);
                throw new errors_1.AppError(400, "BAD_REQUEST", "Invalid Stripe signature");
            }
            if (event.type === "checkout.session.completed") {
                const session = event.data.object;
                const providerId = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.providerId;
                if (!providerId)
                    throw new errors_1.AppError(400, "BAD_REQUEST", "providerId missing in metadata");
                const now = new Date();
                const expiresAt = new Date(now.getTime() + SUBSCRIPTION_DURATION_DAYS * 24 * 60 * 60 * 1000);
                yield this.subscriptionRepo.markPaid(session.id, {
                    paymentStatus: subscription_1.PaymentStatus.PAID,
                    paidAt: now,
                    expiresAt,
                    stripeCustomerId: (_b = session.customer) === null || _b === void 0 ? void 0 : _b.toString(),
                    stripeSubscriptionId: (_c = session.subscription) === null || _c === void 0 ? void 0 : _c.toString(),
                });
                yield this.userRepo.updateByIdWithSubscription(providerId, {
                    subscriptionStatus: subscription_1.SubscriptionStatus.ACTIVE,
                    subscriptionStartDate: now,
                    subscriptionEndDate: expiresAt,
                    stripeCustomerId: (_d = session.customer) === null || _d === void 0 ? void 0 : _d.toString(),
                    stripeSubscriptionId: (_e = session.subscription) === null || _e === void 0 ? void 0 : _e.toString(),
                });
            }
        });
    }
}
exports.SubscriptionService = SubscriptionService;
