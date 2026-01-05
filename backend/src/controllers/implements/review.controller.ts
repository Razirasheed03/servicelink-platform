import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../http/auth.middleware";
import { ReviewService } from "../../services/implements/review.service";
import { ResponseHelper } from "../../http/ResponseHelper";

export class ReviewController {
  constructor(private readonly service: ReviewService) {}

  createReview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.userId!;
    const { providerId, rating, comment } = req.body;

    await this.service.addReview(userId, providerId, rating, comment);
    ResponseHelper.created(res, { ok: true });
  };

  getProviderReviews = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.userId!;
    const { providerId } = req.params;
    const data = await this.service.getProviderReviews(providerId, userId);
    ResponseHelper.ok(res, data);
  };

  editReview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.userId!;
    const { reviewId } = req.params as { reviewId: string };
    const { rating, comment } = req.body as { rating: number; comment?: string };
    await this.service.editReview(userId, reviewId, rating, comment);
    ResponseHelper.ok(res, { ok: true });
  };

  getMyProviderReviews = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.userId!;
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const data = await this.service.getMyProviderReviews(userId, page, limit);
    ResponseHelper.ok(res, data);
  };

  replyToReview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.userId!;
    const { reviewId } = req.params as { reviewId: string };
    const { comment } = req.body as { comment: string };
    await this.service.replyToReview(userId, reviewId, comment);
    ResponseHelper.ok(res, { ok: true });
  };

  getProviderDashboard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.userId!;
    const data = await this.service.getProviderDashboard(userId);
    ResponseHelper.ok(res, data);
  };
}
