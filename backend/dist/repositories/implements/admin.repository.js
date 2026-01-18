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
exports.AdminRepository = void 0;
const roles_1 = require("../../constants/roles");
const user_model_1 = require("../../models/implements/user.model");
const subscription_1 = require("../../constants/subscription");
class AdminRepository {
    getDashboardStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const [totalUsers, totalProviders, verifiedProviders, pendingVerifications, activeProviders, newProvidersThisMonth, approvedCount, pendingCount, rejectedCount, blockedCount,] = yield Promise.all([
                user_model_1.UserModel.countDocuments({ role: roles_1.UserRole.USER }),
                user_model_1.UserModel.countDocuments({ role: roles_1.UserRole.SERVICE_PROVIDER }),
                user_model_1.UserModel.countDocuments({
                    role: roles_1.UserRole.SERVICE_PROVIDER,
                    isBlocked: false,
                    isVerified: true,
                    verificationStatus: "approved",
                }),
                user_model_1.UserModel.countDocuments({
                    role: roles_1.UserRole.SERVICE_PROVIDER,
                    isBlocked: false,
                    verificationStatus: "pending",
                }),
                user_model_1.UserModel.countDocuments({
                    role: roles_1.UserRole.SERVICE_PROVIDER,
                    isBlocked: false,
                    verificationStatus: "approved",
                    isVerified: true,
                    subscriptionStatus: subscription_1.SubscriptionStatus.ACTIVE,
                    subscriptionEndDate: { $gt: now },
                }),
                user_model_1.UserModel.countDocuments({
                    role: roles_1.UserRole.SERVICE_PROVIDER,
                    createdAt: { $gte: startOfMonth },
                }),
                user_model_1.UserModel.countDocuments({
                    role: roles_1.UserRole.SERVICE_PROVIDER,
                    verificationStatus: "approved",
                }),
                user_model_1.UserModel.countDocuments({
                    role: roles_1.UserRole.SERVICE_PROVIDER,
                    verificationStatus: "pending",
                }),
                user_model_1.UserModel.countDocuments({
                    role: roles_1.UserRole.SERVICE_PROVIDER,
                    verificationStatus: "rejected",
                }),
                user_model_1.UserModel.countDocuments({
                    role: roles_1.UserRole.SERVICE_PROVIDER,
                    isBlocked: true,
                }),
            ]);
            return {
                totalUsers,
                totalProviders,
                verifiedProviders,
                pendingVerifications,
                activeProviders,
                newProvidersThisMonth,
                providerStatusCounts: {
                    approved: approvedCount,
                    pending: pendingCount,
                    rejected: rejectedCount,
                    blocked: blockedCount,
                },
            };
        });
    }
    getProviderById(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield user_model_1.UserModel.findOne({ _id: providerId, role: roles_1.UserRole.SERVICE_PROVIDER })
                .select("-password")
                .lean();
            return provider ? provider : null;
        });
    }
    listProviders(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = Math.max(1, options.page || 1);
            const limit = Math.max(1, Math.min(50, options.limit || 12));
            const skip = (page - 1) * limit;
            const filters = {
                role: roles_1.UserRole.SERVICE_PROVIDER,
            };
            const [items, total] = yield Promise.all([
                user_model_1.UserModel.find(filters)
                    .select("-password")
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                user_model_1.UserModel.countDocuments(filters),
            ]);
            return {
                providers: items,
                total,
                page,
                totalPages: Math.max(1, Math.ceil(total / limit)),
            };
        });
    }
    listUsers(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = Math.max(1, options.page || 1);
            const limit = Math.max(1, Math.min(50, options.limit || 12));
            const skip = (page - 1) * limit;
            const filters = {
                role: roles_1.UserRole.USER,
            };
            const [items, total] = yield Promise.all([
                user_model_1.UserModel.find(filters)
                    .select("-password")
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                user_model_1.UserModel.countDocuments(filters),
            ]);
            return {
                users: items,
                total,
                page,
                totalPages: Math.max(1, Math.ceil(total / limit)),
            };
        });
    }
    approveProvider(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield user_model_1.UserModel.findOneAndUpdate({ _id: providerId, role: roles_1.UserRole.SERVICE_PROVIDER }, {
                $set: {
                    isVerified: true,
                    verificationStatus: "approved",
                    subscriptionStatus: subscription_1.SubscriptionStatus.APPROVED_BUT_UNSUBSCRIBED,
                    subscriptionStartDate: null,
                    subscriptionEndDate: null,
                },
                $unset: { verificationReason: "" },
            }, { new: true }).select("-password");
            return updated ? updated.toObject() : null;
        });
    }
    rejectProvider(providerId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield user_model_1.UserModel.findOneAndUpdate({ _id: providerId, role: roles_1.UserRole.SERVICE_PROVIDER }, {
                $set: {
                    isVerified: false,
                    verificationStatus: "rejected",
                    verificationReason: reason,
                },
            }, { new: true }).select("-password");
            return updated ? updated.toObject() : null;
        });
    }
    setUserBlocked(userId, isBlocked) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield user_model_1.UserModel.findOneAndUpdate({ _id: userId, role: roles_1.UserRole.USER }, { $set: { isBlocked } }, { new: true }).select("-password");
            return updated ? updated.toObject() : null;
        });
    }
    setProviderBlocked(providerId, isBlocked) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield user_model_1.UserModel.findOneAndUpdate({ _id: providerId, role: roles_1.UserRole.SERVICE_PROVIDER }, { $set: { isBlocked } }, { new: true }).select("-password");
            return updated ? updated.toObject() : null;
        });
    }
}
exports.AdminRepository = AdminRepository;
