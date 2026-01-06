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
exports.UserService = void 0;
const roles_1 = require("../../constants/roles");
const errors_1 = require("../../http/errors");
class UserService {
    constructor(_userRepo) {
        this._userRepo = _userRepo;
    }
    getProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._userRepo.findPublicById(userId);
        });
    }
    updateProfile(userId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepo.findById(userId);
            if (!user)
                return null;
            const isProvider = user.role === roles_1.UserRole.SERVICE_PROVIDER;
            // Enforce: location and experience only for service providers
            const update = {};
            if (payload.username !== undefined)
                update.username = payload.username;
            if (payload.phone !== undefined)
                update.phone = payload.phone;
            if (payload.serviceType !== undefined)
                update.serviceType = payload.serviceType;
            if (payload.consultationFee !== undefined) {
                if (!isProvider) {
                    // ignore
                }
                else {
                    const fee = Number(payload.consultationFee);
                    if (Number.isNaN(fee) || fee < 0)
                        throw new errors_1.ValidationAppError("Consultation fee must be a non-negative number");
                    update.consultationFee = fee;
                }
            }
            if (payload.location !== undefined || payload.experience !== undefined) {
                if (!isProvider) {
                    // Ignore disallowed fields if not a provider
                    // Alternatively, could throw an error; requirement is they are only for providers
                }
                else {
                    if (payload.location !== undefined)
                        update.location = payload.location;
                    if (payload.experience !== undefined)
                        update.experience = payload.experience;
                }
            }
            return this._userRepo.updateByIdPublic(userId, update);
        });
    }
    listProviders(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._userRepo.listProviders(options);
        });
    }
    getProviderById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepo.findPublicById(id);
            if (!user)
                return null;
            const isProvider = user.role === roles_1.UserRole.SERVICE_PROVIDER;
            const blocked = !!user.isBlocked;
            const verified = !!user.isVerified;
            const status = user.verificationStatus;
            if (!isProvider || blocked)
                return null;
            if (!verified || status !== "approved")
                return null;
            return user;
        });
    }
    reapplyVerification(providerUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepo.findById(providerUserId);
            if (!user)
                return null;
            if (user.role !== roles_1.UserRole.SERVICE_PROVIDER) {
                throw new errors_1.AppError(403, "FORBIDDEN", "Forbidden");
            }
            if (user.isBlocked) {
                throw new errors_1.AppError(403, "FORBIDDEN", "Forbidden");
            }
            return this._userRepo.updateByIdPublic(providerUserId, {
                isVerified: false,
                verificationStatus: "pending",
                verificationReason: undefined,
            });
        });
    }
}
exports.UserService = UserService;
