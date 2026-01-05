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
exports.ReviewController = void 0;
const ResponseHelper_1 = require("../../http/ResponseHelper");
class ReviewController {
    constructor(service) {
        this.service = service;
        this.createReview = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            const { providerId, rating, comment } = req.body;
            yield this.service.addReview(userId, providerId, rating, comment);
            ResponseHelper_1.ResponseHelper.created(res, { ok: true });
        });
        this.getProviderReviews = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            const { providerId } = req.params;
            const data = yield this.service.getProviderReviews(providerId, userId);
            ResponseHelper_1.ResponseHelper.ok(res, data);
        });
        this.editReview = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            const { reviewId } = req.params;
            const { rating, comment } = req.body;
            yield this.service.editReview(userId, reviewId, rating, comment);
            ResponseHelper_1.ResponseHelper.ok(res, { ok: true });
        });
        this.getMyProviderReviews = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            const page = req.query.page ? Number(req.query.page) : 1;
            const limit = req.query.limit ? Number(req.query.limit) : 10;
            const data = yield this.service.getMyProviderReviews(userId, page, limit);
            ResponseHelper_1.ResponseHelper.ok(res, data);
        });
        this.replyToReview = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            const { reviewId } = req.params;
            const { comment } = req.body;
            yield this.service.replyToReview(userId, reviewId, comment);
            ResponseHelper_1.ResponseHelper.ok(res, { ok: true });
        });
        this.getProviderDashboard = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            const data = yield this.service.getProviderDashboard(userId);
            ResponseHelper_1.ResponseHelper.ok(res, data);
        });
    }
}
exports.ReviewController = ReviewController;
