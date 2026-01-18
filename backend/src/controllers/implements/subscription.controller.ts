import { Response, NextFunction, Request } from "express";
import { AuthenticatedRequest } from "../../http/auth.middleware";
import { ResponseHelper } from "../../http/ResponseHelper";
import { HttpResponse } from "../../constants/MessageConstant";
import { ISubscriptionController } from "../interfaces/subscription.controller.interface";
import { ISubscriptionService } from "../../services/interfaces/subscription.service.interface";
import { IUserRepository } from "../../repositories/interface/user.repository.interface";
import { UserRole } from "../../constants/roles";

export class SubscriptionController implements ISubscriptionController {
  constructor(
    private readonly subscriptionService: ISubscriptionService,
    private readonly userRepo: IUserRepository
  ) {}

  createCheckoutSession = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const providerUserId = req.userId!;
      const user = await this.userRepo.findById(providerUserId);
      if (!user || user.role !== UserRole.SERVICE_PROVIDER) {
        ResponseHelper.forbidden(res, "Only service providers can subscribe");
        return;
      }
      const { checkoutUrl, sessionId } = await this.subscriptionService.createCheckoutSession(providerUserId);
      ResponseHelper.ok(res, { checkoutUrl, sessionId }, HttpResponse.RESOURCE_FOUND);
    } catch (err) {
      next(err);
    }
  };

  getSubscriptionStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const providerUserId = req.userId!;
      const status = await this.subscriptionService.getSubscriptionStatus(providerUserId);
      ResponseHelper.ok(res, status, HttpResponse.RESOURCE_FOUND);
    } catch (err) {
      next(err);
    }
  };

  handleStripeWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const signature = req.headers["stripe-signature"] as string | undefined;
      await this.subscriptionService.handleStripeWebhook(signature, req.body as Buffer);
      res.status(200).json({ received: true });
    } catch (err) {
      next(err);
    }
  };
}
