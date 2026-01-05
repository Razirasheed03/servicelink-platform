import { IReviewService } from "../interfaces/review.service.interface";
import { IReviewRepository } from "../../repositories/interface/review.repository.interface";
import {
	IProviderReviewsResponse,
	IProviderReviewsPagedResponse,
	IProviderDashboardResponse,
	IReviewViewModel,
} from "../../models/interfaces/review.model.interface";
import { IUserRepository } from "../../repositories/interface/user.repository.interface";
import { UserRole } from "../../constants/roles";
import { AppError, NotFoundError, ValidationAppError } from "../../http/errors";

export class ReviewService implements IReviewService {
	constructor(
		private readonly repo: IReviewRepository,
		private readonly userRepo: IUserRepository
	) {}

	private async requireRole(userId: string, role: UserRole): Promise<void> {
		const user = await this.userRepo.findById(userId);
		if (!user) throw new AppError(401, "UNAUTHORIZED", "Unauthorized");
		if (user.role !== role) throw new AppError(403, "FORBIDDEN", "Forbidden");
	}

	private mapReview(r: {
		_id: string;
		userId?: { _id?: string; username?: string };
		rating: number;
		comment?: string;
		createdAt?: Date | string;
		reply?: { comment?: string; updatedAt?: Date | string };
	}, viewerUserId: string): IReviewViewModel {
		const reviewUserId = r.userId?._id ? String(r.userId._id) : "";
		const replyComment = r.reply?.comment;
		const replyDate = r.reply?.updatedAt;
		return {
			id: String(r._id),
			userName: r.userId?.username || "Anonymous",
			rating: r.rating,
			comment: r.comment,
			date: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
			isOwner: reviewUserId !== "" && reviewUserId === viewerUserId,
			...(replyComment
				? {
					reply: {
						comment: replyComment,
						date: replyDate ? new Date(replyDate).toISOString() : new Date().toISOString(),
					},
				}
				: {}),
		};
	}

	async addReview(userId: string, providerId: string, rating: number, comment?: string) {
		await this.requireRole(userId, UserRole.USER);
		if (typeof rating !== "number" || rating < 1 || rating > 5) {
			throw new ValidationAppError("Rating must be between 1 and 5");
		}

		const existing = await this.repo.findByProviderAndUser(providerId, userId);
		if (existing) {
			throw new AppError(409, "CONFLICT", "You already reviewed this provider");
		}

		await this.repo.create({ userId, providerId, rating, comment });
	}

	async editReview(userId: string, reviewId: string, rating: number, comment?: string): Promise<void> {
		await this.requireRole(userId, UserRole.USER);
		if (typeof rating !== "number" || rating < 1 || rating > 5) {
			throw new ValidationAppError("Rating must be between 1 and 5");
		}

		const result = await this.repo.updateUserReview(reviewId, userId, { rating, comment });
		if (result.matched > 0) return;

		const existing = await this.repo.findById(reviewId);
		if (!existing) throw new NotFoundError("Review not found");
		throw new AppError(403, "FORBIDDEN", "You can only edit your own review");
	}

	async getProviderReviews(providerId: string, viewerUserId: string): Promise<IProviderReviewsResponse> {
		const rawReviews = await this.repo.findByProvider(providerId);
		const reviews: IReviewViewModel[] = (rawReviews as {
			_id: string;
			userId?: { _id?: string; username?: string };
			rating: number;
			comment?: string;
			createdAt?: Date | string;
			reply?: { comment?: string; updatedAt?: Date | string };
		}[]).map((r) => this.mapReview(r, viewerUserId));
		const stats = await this.repo.getStats(providerId);
		return { reviews, ...stats };
	}

	async getMyProviderReviews(
		providerUserId: string,
		page: number,
		limit: number
	): Promise<IProviderReviewsPagedResponse> {
		await this.requireRole(providerUserId, UserRole.SERVICE_PROVIDER);
		const paged = await this.repo.findByProviderPaged(providerUserId, page, limit);
		const reviews = (paged.items as {
			_id: string;
			userId?: { _id?: string; username?: string };
			rating: number;
			comment?: string;
			createdAt?: Date | string;
			reply?: { comment?: string; updatedAt?: Date | string };
		}[]).map((r) => this.mapReview(r, providerUserId));
		const stats = await this.repo.getStats(providerUserId);
		return { ...stats, reviews, page: paged.page, totalPages: paged.totalPages };
	}

	async replyToReview(providerUserId: string, reviewId: string, comment: string): Promise<void> {
		await this.requireRole(providerUserId, UserRole.SERVICE_PROVIDER);
		if (!comment || !comment.trim()) throw new ValidationAppError("Reply comment is required");

		const existing = await this.repo.findById(reviewId);
		if (!existing) throw new NotFoundError("Review not found");
		const providerId = String((existing as any).providerId);
		if (providerId !== providerUserId) {
			throw new AppError(403, "FORBIDDEN", "You can only reply to reviews about you");
		}

		const result = await this.repo.upsertReply(reviewId, providerUserId, comment);
		if (result.matched === 0) {
			throw new AppError(403, "FORBIDDEN", "You can only reply to reviews about you");
		}
	}

	async getProviderDashboard(providerUserId: string): Promise<IProviderDashboardResponse> {
		await this.requireRole(providerUserId, UserRole.SERVICE_PROVIDER);
		const stats = await this.repo.getStats(providerUserId);
		const recent = await this.repo.findByProviderPaged(providerUserId, 1, 5);
		const recentReviews = (recent.items as {
			_id: string;
			userId?: { _id?: string; username?: string };
			rating: number;
			comment?: string;
			createdAt?: Date | string;
			reply?: { comment?: string; updatedAt?: Date | string };
		}[]).map((r) => this.mapReview(r, providerUserId));

		return {
			avgRating: stats.avgRating,
			totalReviews: stats.total,
			recentReviews,
			completedJobs: 42,
		};
	}
}
