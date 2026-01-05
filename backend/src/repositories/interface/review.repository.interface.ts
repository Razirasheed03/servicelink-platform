import { IReviewStats } from "../../models/interfaces/review.model.interface";

export interface CreateReviewDTO {
  userId: string;
  providerId: string;
  rating: number;
  comment?: string;
}

export interface IReviewRepository {
  create(review: CreateReviewDTO): Promise<void>;
  findByProvider(providerId: string): Promise<unknown[]>;
  findByProviderPaged(
    providerId: string,
    page: number,
    limit: number
  ): Promise<{ items: unknown[]; total: number; page: number; totalPages: number }>;
  findById(reviewId: string): Promise<unknown | null>;
  findByProviderAndUser(providerId: string, userId: string): Promise<{ _id: string } | null>;
  updateUserReview(
    reviewId: string,
    userId: string,
    update: { rating: number; comment?: string }
  ): Promise<{ matched: number }>;
  upsertReply(
    reviewId: string,
    providerId: string,
    comment: string
  ): Promise<{ matched: number }>;
  getStats(providerId: string): Promise<IReviewStats>;
}
