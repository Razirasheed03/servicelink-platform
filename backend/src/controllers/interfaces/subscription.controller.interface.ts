import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../http/auth.middleware";

export interface ISubscriptionController {
  createCheckoutSession(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
  getSubscriptionStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
  handleStripeWebhook(req: Request, res: Response, next: NextFunction): Promise<void>;
}
