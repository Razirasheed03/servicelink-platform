import {
	IProviderDashboardResponse,
	IProviderReviewsPagedResponse,
	IProviderReviewsResponse,
} from "../../models/interfaces/review.model.interface";

export interface IReviewService {
  addReview(userId: string, providerId: string, rating: number, comment?: string): Promise<void>;
  editReview(userId: string, reviewId: string, rating: number, comment?: string): Promise<void>;
  getProviderReviews(providerId: string, viewerUserId: string): Promise<IProviderReviewsResponse>;
  getMyProviderReviews(
    providerUserId: string,
    page: number,
    limit: number
  ): Promise<IProviderReviewsPagedResponse>;
  replyToReview(providerUserId: string, reviewId: string, comment: string): Promise<void>;
  getProviderDashboard(providerUserId: string): Promise<IProviderDashboardResponse>;
}
