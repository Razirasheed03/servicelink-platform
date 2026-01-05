import { Review } from "../../schema/review.schema";
import { CreateReviewDTO, IReviewRepository } from "../interface/review.repository.interface";
import { IReviewStats } from "../../models/interfaces/review.model.interface";

export class ReviewRepository implements IReviewRepository {
  async create(data: CreateReviewDTO): Promise<void> {
    await Review.create(data);
  }

  async findByProvider(providerId: string): Promise<unknown[]> {
    return Review.find({ providerId })
      .populate("userId", "username")
      .sort({ createdAt: -1 })
      .lean();
  }

	async findByProviderPaged(
		providerId: string,
		page: number,
		limit: number
	): Promise<{ items: unknown[]; total: number; page: number; totalPages: number }> {
		const safePage = Math.max(1, page || 1);
		const safeLimit = Math.max(1, Math.min(50, limit || 10));
		const skip = (safePage - 1) * safeLimit;

		const [items, total] = await Promise.all([
			Review.find({ providerId })
				.populate("userId", "username")
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(safeLimit)
				.lean(),
			Review.countDocuments({ providerId }),
		]);

		return {
			items,
			total,
			page: safePage,
			totalPages: Math.max(1, Math.ceil(total / safeLimit)),
		};
	}

	async findById(reviewId: string): Promise<unknown | null> {
		return Review.findById(reviewId).populate("userId", "username").lean();
	}

	async findByProviderAndUser(providerId: string, userId: string): Promise<{ _id: string } | null> {
		const doc = await Review.findOne({ providerId, userId }).select("_id").lean();
		return doc ? { _id: String((doc as any)._id) } : null;
	}

	async updateUserReview(
		reviewId: string,
		userId: string,
		update: { rating: number; comment?: string }
	): Promise<{ matched: number }> {
		const result = await Review.updateOne(
			{ _id: reviewId, userId },
			{ $set: { rating: update.rating, comment: update.comment } }
		);
		return { matched: result.matchedCount };
	}

	async upsertReply(
		reviewId: string,
		providerId: string,
		comment: string
	): Promise<{ matched: number }> {
		const result = await Review.updateOne(
			{ _id: reviewId, providerId },
			{ $set: { "reply.comment": comment, "reply.updatedAt": new Date() } }
		);
		return { matched: result.matchedCount };
	}

  async getStats(providerId: string): Promise<IReviewStats> {
    const result = await Review.aggregate([
      { $match: { providerId: new (require("mongoose")).Types.ObjectId(providerId) } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          total: { $sum: 1 },
        },
      },
    ]);

    return {
      avgRating: (result[0]?.avgRating as number | undefined) || 0,
      total: (result[0]?.total as number | undefined) || 0,
    };
  }
}
