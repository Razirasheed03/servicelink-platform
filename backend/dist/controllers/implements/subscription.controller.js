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
exports.SubscriptionController = void 0;
const ResponseHelper_1 = require("../../http/ResponseHelper");
const MessageConstant_1 = require("../../constants/MessageConstant");
const roles_1 = require("../../constants/roles");
class SubscriptionController {
    constructor(subscriptionService, userRepo) {
        this.subscriptionService = subscriptionService;
        this.userRepo = userRepo;
        this.createCheckoutSession = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const providerUserId = req.userId;
                const user = yield this.userRepo.findById(providerUserId);
                if (!user || user.role !== roles_1.UserRole.SERVICE_PROVIDER) {
                    ResponseHelper_1.ResponseHelper.forbidden(res, "Only service providers can subscribe");
                    return;
                }
                const { checkoutUrl, sessionId } = yield this.subscriptionService.createCheckoutSession(providerUserId);
                ResponseHelper_1.ResponseHelper.ok(res, { checkoutUrl, sessionId }, MessageConstant_1.HttpResponse.RESOURCE_FOUND);
            }
            catch (err) {
                next(err);
            }
        });
        this.getSubscriptionStatus = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const providerUserId = req.userId;
                const status = yield this.subscriptionService.getSubscriptionStatus(providerUserId);
                ResponseHelper_1.ResponseHelper.ok(res, status, MessageConstant_1.HttpResponse.RESOURCE_FOUND);
            }
            catch (err) {
                next(err);
            }
        });
        this.handleStripeWebhook = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const signature = req.headers["stripe-signature"];
                yield this.subscriptionService.handleStripeWebhook(signature, req.body);
                res.status(200).json({ received: true });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.SubscriptionController = SubscriptionController;
