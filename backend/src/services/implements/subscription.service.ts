import Stripe from "stripe";
import { env } from "../../config/env";
import { ISubscriptionService, SubscriptionStatusResponse } from "../interfaces/subscription.service.interface";
import { IUserRepository } from "../../repositories/interface/user.repository.interface";
import { ISubscriptionRepository } from "../../repositories/interface/subscription.repository.interface";
import { SubscriptionStatus, PaymentStatus } from "../../constants/subscription";
import { AppError, ValidationAppError } from "../../http/errors";

const SUBSCRIPTION_DURATION_DAYS = 30;
const SUBSCRIPTION_AMOUNT = 199; // INR 199 per month

export class SubscriptionService implements ISubscriptionService {
  private stripe: Stripe;

  constructor(
    private readonly userRepo: IUserRepository,
    private readonly subscriptionRepo: ISubscriptionRepository
  ) {
    this.stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-10-29.clover",
    });
  }

  async createCheckoutSession(providerUserId: string): Promise<{ checkoutUrl: string; sessionId: string }> {
    const provider = await this.userRepo.findProviderById(providerUserId);
    if (!provider) throw new AppError(404, "NOT_FOUND", "Provider not found");
    if (provider.isBlocked) throw new AppError(403, "FORBIDDEN", "Blocked providers cannot subscribe");
    if (!provider.isVerified || provider.verificationStatus !== "approved") {
      throw new ValidationAppError("Provider must be approved by admin before subscribing");
    }

    // Guard active subscription
    if (
      provider.subscriptionStatus === SubscriptionStatus.ACTIVE &&
      provider.subscriptionEndDate &&
      provider.subscriptionEndDate > new Date()
    ) {
      throw new ValidationAppError("Subscription already active");
    }

    // Ensure stripe customer
    let customerId = provider.stripeCustomerId;
    if (!customerId) {
      const customer = await this.stripe.customers.create({
        email: provider.email,
        name: provider.username,
        metadata: { providerId: providerUserId },
      });
      customerId = customer.id;
      await this.userRepo.updateByIdWithSubscription(providerUserId, {
        stripeCustomerId: customerId,
      });
    }

    const session = await this.stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [
        {
          price: env.STRIPE_PROVIDER_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${env.FRONTEND_URL}/provider/home?payment=success`,
      cancel_url: `${env.FRONTEND_URL}/provider/home?payment=cancelled`,
      metadata: {
        providerId: providerUserId,
      },
    });

    // Record pending subscription
    await this.subscriptionRepo.create({
      providerId: provider._id,
      amount: SUBSCRIPTION_AMOUNT,
      paymentStatus: PaymentStatus.PENDING,
      stripeSessionId: session.id,
      stripeCustomerId: customerId,
      stripeSubscriptionId: (session.subscription as string) || undefined,
      paidAt: null,
      expiresAt: null,
    });

    await this.userRepo.updateByIdWithSubscription(providerUserId, {
      subscriptionStatus: SubscriptionStatus.APPROVED_BUT_UNSUBSCRIBED,
    });

    return { checkoutUrl: session.url!, sessionId: session.id };
  }

  async getSubscriptionStatus(providerUserId: string): Promise<SubscriptionStatusResponse> {
    const provider = await this.userRepo.findProviderById(providerUserId);
    if (!provider) throw new AppError(404, "NOT_FOUND", "Provider not found");

    // Auto-expire if needed
    if (
      provider.subscriptionStatus === SubscriptionStatus.ACTIVE &&
      provider.subscriptionEndDate &&
      provider.subscriptionEndDate <= new Date()
    ) {
      const updated = await this.userRepo.updateByIdWithSubscription(providerUserId, {
        subscriptionStatus: SubscriptionStatus.EXPIRED,
      });
      return {
        status: SubscriptionStatus.EXPIRED,
        startDate: updated?.subscriptionStartDate ?? null,
        endDate: updated?.subscriptionEndDate ?? provider.subscriptionEndDate ?? null,
        message: "Subscription expired. Please renew.",
      };
    }

    return {
      status: provider.subscriptionStatus || SubscriptionStatus.PENDING_APPROVAL,
      startDate: provider.subscriptionStartDate ?? null,
      endDate: provider.subscriptionEndDate ?? null,
      message:
        provider.subscriptionStatus === SubscriptionStatus.EXPIRED
          ? "Subscription expired. Please renew."
          : undefined,
    };
  }

  async handleStripeWebhook(signature: string | undefined, rawBody: Buffer): Promise<void> {
    if (!signature) throw new AppError(400, "BAD_REQUEST", "Missing Stripe signature");

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
      console.error("Stripe webhook signature verification failed", err?.message);
      throw new AppError(400, "BAD_REQUEST", "Invalid Stripe signature");
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const providerId = session.metadata?.providerId;
      if (!providerId) throw new AppError(400, "BAD_REQUEST", "providerId missing in metadata");

      const now = new Date();
      const expiresAt = new Date(now.getTime() + SUBSCRIPTION_DURATION_DAYS * 24 * 60 * 60 * 1000);

      await this.subscriptionRepo.markPaid(session.id, {
        paymentStatus: PaymentStatus.PAID,
        paidAt: now,
        expiresAt,
        stripeCustomerId: session.customer?.toString(),
        stripeSubscriptionId: session.subscription?.toString(),
      });

      await this.userRepo.updateByIdWithSubscription(providerId, {
        subscriptionStatus: SubscriptionStatus.ACTIVE,
        subscriptionStartDate: now,
        subscriptionEndDate: expiresAt,
        stripeCustomerId: session.customer?.toString(),
        stripeSubscriptionId: session.subscription?.toString(),
      });
    }
  }
}
