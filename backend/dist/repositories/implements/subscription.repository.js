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
exports.SubscriptionRepository = void 0;
const subscription_model_1 = require("../../models/implements/subscription.model");
class SubscriptionRepository {
    create(record) {
        return __awaiter(this, void 0, void 0, function* () {
            const created = yield subscription_model_1.SubscriptionModel.create(record);
            return created;
        });
    }
    findBySessionId(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return subscription_model_1.SubscriptionModel.findOne({ stripeSessionId: sessionId });
        });
    }
    markPaid(sessionId, update) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield subscription_model_1.SubscriptionModel.findOneAndUpdate({ stripeSessionId: sessionId }, { $set: update }, { new: true });
            return updated;
        });
    }
}
exports.SubscriptionRepository = SubscriptionRepository;
