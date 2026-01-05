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
exports.ReviewService = void 0;
const roles_1 = require("../../constants/roles");
const errors_1 = require("../../http/errors");
class ReviewService {
    constructor(repo, userRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
    }
    requireRole(userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.findById(userId);
            if (!user)
                throw new errors_1.AppError(401, "UNAUTHORIZED", "Unauthorized");
            if (user.role !== role)
                throw new errors_1.AppError(403, "FORBIDDEN", "Forbidden");
        });
    }
    mapReview(r, viewerUserId) {
        var _a, _b, _c, _d;
        const reviewUserId = ((_a = r.userId) === null || _a === void 0 ? void 0 : _a._id) ? String(r.userId._id) : "";
        const replyComment = (_b = r.reply) === null || _b === void 0 ? void 0 : _b.comment;
        const replyDate = (_c = r.reply) === null || _c === void 0 ? void 0 : _c.updatedAt;
        return Object.assign({ id: String(r._id), userName: ((_d = r.userId) === null || _d === void 0 ? void 0 : _d.username) || "Anonymous", rating: r.rating, comment: r.comment, date: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(), isOwner: reviewUserId !== "" && reviewUserId === viewerUserId }, (replyComment
            ? {
                reply: {
                    comment: replyComment,
                    date: replyDate ? new Date(replyDate).toISOString() : new Date().toISOString(),
                },
            }
            : {}));
    }
    addReview(userId, providerId, rating, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.requireRole(userId, roles_1.UserRole.USER);
            if (typeof rating !== "number" || rating < 1 || rating > 5) {
                throw new errors_1.ValidationAppError("Rating must be between 1 and 5");
            }
            const existing = yield this.repo.findByProviderAndUser(providerId, userId);
            if (existing) {
                throw new errors_1.AppError(409, "CONFLICT", "You already reviewed this provider");
            }
            yield this.repo.create({ userId, providerId, rating, comment });
        });
    }
    editReview(userId, reviewId, rating, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.requireRole(userId, roles_1.UserRole.USER);
            if (typeof rating !== "number" || rating < 1 || rating > 5) {
                throw new errors_1.ValidationAppError("Rating must be between 1 and 5");
            }
            const result = yield this.repo.updateUserReview(reviewId, userId, { rating, comment });
            if (result.matched > 0)
                return;
            const existing = yield this.repo.findById(reviewId);
            if (!existing)
                throw new errors_1.NotFoundError("Review not found");
            throw new errors_1.AppError(403, "FORBIDDEN", "You can only edit your own review");
        });
    }
    getProviderReviews(providerId, viewerUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawReviews = yield this.repo.findByProvider(providerId);
            const reviews = rawReviews.map((r) => this.mapReview(r, viewerUserId));
            const stats = yield this.repo.getStats(providerId);
            return Object.assign({ reviews }, stats);
        });
    }
    getMyProviderReviews(providerUserId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.requireRole(providerUserId, roles_1.UserRole.SERVICE_PROVIDER);
            const paged = yield this.repo.findByProviderPaged(providerUserId, page, limit);
            const reviews = paged.items.map((r) => this.mapReview(r, providerUserId));
            const stats = yield this.repo.getStats(providerUserId);
            return Object.assign(Object.assign({}, stats), { reviews, page: paged.page, totalPages: paged.totalPages });
        });
    }
    replyToReview(providerUserId, reviewId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.requireRole(providerUserId, roles_1.UserRole.SERVICE_PROVIDER);
            if (!comment || !comment.trim())
                throw new errors_1.ValidationAppError("Reply comment is required");
            const existing = yield this.repo.findById(reviewId);
            if (!existing)
                throw new errors_1.NotFoundError("Review not found");
            const providerId = String(existing.providerId);
            if (providerId !== providerUserId) {
                throw new errors_1.AppError(403, "FORBIDDEN", "You can only reply to reviews about you");
            }
            const result = yield this.repo.upsertReply(reviewId, providerUserId, comment);
            if (result.matched === 0) {
                throw new errors_1.AppError(403, "FORBIDDEN", "You can only reply to reviews about you");
            }
        });
    }
    getProviderDashboard(providerUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.requireRole(providerUserId, roles_1.UserRole.SERVICE_PROVIDER);
            const stats = yield this.repo.getStats(providerUserId);
            const recent = yield this.repo.findByProviderPaged(providerUserId, 1, 5);
            const recentReviews = recent.items.map((r) => this.mapReview(r, providerUserId));
            return {
                avgRating: stats.avgRating,
                totalReviews: stats.total,
                recentReviews,
                completedJobs: 42,
            };
        });
    }
}
exports.ReviewService = ReviewService;
