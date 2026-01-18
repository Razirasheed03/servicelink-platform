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
exports.UserRepository = void 0;
//repositories/implements/user.repository.ts
const baseRepository_1 = require("../baseRepository");
const user_model_1 = require("../../models/implements/user.model");
const roles_1 = require("../../constants/roles");
const subscription_1 = require("../../constants/subscription");
class UserRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(user_model_1.UserModel);
    }
    createUser(user) {
        const _super = Object.create(null, {
            create: { get: () => super.create }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.create.call(this, user);
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne({ email });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findById(id);
        });
    }
    findProviderById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne({ _id: id, role: roles_1.UserRole.SERVICE_PROVIDER });
        });
    }
    findPublicById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.model.findById(id).select("-password");
            return user ? user.toObject() : null;
        });
    }
    updateByIdPublic(id, update) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.model
                .findByIdAndUpdate(id, { $set: update }, {
                new: true,
                runValidators: true,
                context: "query",
            })
                .select("-password");
            return updated ? updated.toObject() : null;
        });
    }
    updateByIdWithSubscription(id, update) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.model
                .findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true, context: "query" })
                .select("-password");
            return updated ? updated.toObject() : null;
        });
    }
    listProviders(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = Math.max(1, options.page || 1);
            const limit = Math.max(1, Math.min(50, options.limit || 12));
            const skip = (page - 1) * limit;
            const now = new Date();
            const filters = {
                role: roles_1.UserRole.SERVICE_PROVIDER,
                isBlocked: false,
                isVerified: true,
                verificationStatus: "approved",
                subscriptionStatus: subscription_1.SubscriptionStatus.ACTIVE,
                subscriptionEndDate: { $gt: now },
            };
            if (options.serviceType) {
                filters.serviceType = options.serviceType;
            }
            if (options.search) {
                const q = options.search.trim();
                filters.$or = [
                    { username: { $regex: q, $options: "i" } },
                    { email: { $regex: q, $options: "i" } },
                    { serviceType: { $regex: q, $options: "i" } },
                    { location: { $regex: q, $options: "i" } },
                ];
            }
            const [items, total] = yield Promise.all([
                this.model
                    .find(filters)
                    .select("-password")
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                this.model.countDocuments(filters),
            ]);
            return {
                providers: items,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            };
        });
    }
    markProvidersExpired(cutoffDate) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const res = yield this.model.updateMany({
                role: roles_1.UserRole.SERVICE_PROVIDER,
                subscriptionStatus: subscription_1.SubscriptionStatus.ACTIVE,
                subscriptionEndDate: { $lte: cutoffDate },
            }, {
                $set: {
                    subscriptionStatus: subscription_1.SubscriptionStatus.EXPIRED,
                },
            });
            return (_a = res.modifiedCount) !== null && _a !== void 0 ? _a : 0;
        });
    }
    updateUserBlockStatus(userId, isBlocked) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.UserModel.findByIdAndUpdate(userId, { isBlocked }, { new: true }).select("-password");
            if (!user) {
                throw new Error("User not found");
            }
            return user.toObject();
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_model_1.UserModel.findByIdAndDelete(userId);
            if (!result) {
                throw new Error("User not found");
            }
        });
    }
    updateUsername(userId, username) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.model
                .findByIdAndUpdate(userId, { $set: { username } }, { new: true, runValidators: true, context: "query" })
                .select("-password");
            return updated ? updated.toObject() : null;
        });
    }
}
exports.UserRepository = UserRepository;
