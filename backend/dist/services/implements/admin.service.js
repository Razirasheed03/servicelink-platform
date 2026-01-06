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
exports.AdminService = void 0;
const roles_1 = require("../../constants/roles");
const errors_1 = require("../../http/errors");
class AdminService {
    constructor(adminRepo, userRepo) {
        this.adminRepo = adminRepo;
        this.userRepo = userRepo;
    }
    assertAdmin(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.findById(userId);
            if (!user)
                throw new errors_1.AppError(401, "UNAUTHORIZED", "Unauthorized");
            if (user.role !== roles_1.UserRole.ADMIN)
                throw new errors_1.AppError(403, "FORBIDDEN", "Forbidden");
        });
    }
    getDashboardStats(adminUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.assertAdmin(adminUserId);
            return this.adminRepo.getDashboardStats();
        });
    }
    getProviderById(adminUserId, providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.assertAdmin(adminUserId);
            const provider = yield this.adminRepo.getProviderById(providerId);
            if (!provider)
                throw new errors_1.NotFoundError("Provider not found");
            return provider;
        });
    }
    listProviders(adminUserId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.assertAdmin(adminUserId);
            return this.adminRepo.listProviders(options);
        });
    }
    listUsers(adminUserId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.assertAdmin(adminUserId);
            return this.adminRepo.listUsers(options);
        });
    }
    approveProvider(adminUserId, providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.assertAdmin(adminUserId);
            const updated = yield this.adminRepo.approveProvider(providerId);
            if (!updated)
                throw new errors_1.NotFoundError("Provider not found");
            return updated;
        });
    }
    rejectProvider(adminUserId, providerId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.assertAdmin(adminUserId);
            if (!reason || !reason.trim())
                throw new errors_1.ValidationAppError("Rejection reason is required");
            const updated = yield this.adminRepo.rejectProvider(providerId, reason.trim());
            if (!updated)
                throw new errors_1.NotFoundError("Provider not found");
            return updated;
        });
    }
    setUserBlocked(adminUserId, userId, isBlocked) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.assertAdmin(adminUserId);
            const updated = yield this.adminRepo.setUserBlocked(userId, isBlocked);
            if (!updated)
                throw new errors_1.NotFoundError("User not found");
            return updated;
        });
    }
    setProviderBlocked(adminUserId, providerId, isBlocked) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.assertAdmin(adminUserId);
            const updated = yield this.adminRepo.setProviderBlocked(providerId, isBlocked);
            if (!updated)
                throw new errors_1.NotFoundError("Provider not found");
            return updated;
        });
    }
}
exports.AdminService = AdminService;
