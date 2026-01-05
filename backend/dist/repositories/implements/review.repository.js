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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRepository = void 0;
const review_schema_1 = require("../../schema/review.schema");
class ReviewRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield review_schema_1.Review.create(data);
        });
    }
    findByProvider(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return review_schema_1.Review.find({ providerId })
                .populate("userId", "username")
                .sort({ createdAt: -1 })
                .lean();
        });
    }
    findByProviderPaged(providerId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const safePage = Math.max(1, page || 1);
            const safeLimit = Math.max(1, Math.min(50, limit || 10));
            const skip = (safePage - 1) * safeLimit;
            const [items, total] = yield Promise.all([
                review_schema_1.Review.find({ providerId })
                    .populate("userId", "username")
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(safeLimit)
                    .lean(),
                review_schema_1.Review.countDocuments({ providerId }),
            ]);
            return {
                items,
                total,
                page: safePage,
                totalPages: Math.max(1, Math.ceil(total / safeLimit)),
            };
        });
    }
    findById(reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            return review_schema_1.Review.findById(reviewId).populate("userId", "username").lean();
        });
    }
    findByProviderAndUser(providerId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield review_schema_1.Review.findOne({ providerId, userId }).select("_id").lean();
            return doc ? { _id: String(doc._id) } : null;
        });
    }
    updateUserReview(reviewId, userId, update) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield review_schema_1.Review.updateOne({ _id: reviewId, userId }, { $set: { rating: update.rating, comment: update.comment } });
            return { matched: result.matchedCount };
        });
    }
    upsertReply(reviewId, providerId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield review_schema_1.Review.updateOne({ _id: reviewId, providerId }, { $set: { "reply.comment": comment, "reply.updatedAt": new Date() } });
            return { matched: result.matchedCount };
        });
    }
    getStats(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const result = yield review_schema_1.Review.aggregate([
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
                avgRating: ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.avgRating) || 0,
                total: ((_b = result[0]) === null || _b === void 0 ? void 0 : _b.total) || 0,
            };
        });
    }
}
exports.ReviewRepository = ReviewRepository;
