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
// src/repositories/implements/UserRepository.ts
const baseRepository_1 = require("../baseRepository");
const user_model_1 = require("../../models/implements/user.model");
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
    //   async getAllUsers(
    //     page = 1,
    //     limit = 10,
    //     search = ""
    //   ): Promise<{
    //     users: Omit<IUserModel, "password">[];
    //     total: number;
    //     page: number;
    //     totalPages: number;
    //   }> {
    //     const skip = (page - 1) * limit;
    //     const searchQuery = search
    //       ? {
    //           $or: [
    //             { username: { $regex: search, $options: "i" } },
    //             { email: { $regex: search, $options: "i" } }
    //           ]
    //         }
    //       : {};
    //     const users = await UserModel
    //       .find(searchQuery)
    //       .select("-password")
    //       .sort({ createdAt: -1 })
    //       .skip(skip)
    //       .limit(limit)
    //       .lean();
    //     const total = await UserModel.countDocuments(searchQuery);
    //     const totalPages = Math.ceil(total / limit);
    //     return {
    //       users: users as Omit<IUserModel, "password">[],
    //       total,
    //       page,
    //       totalPages
    //     };
    //   }
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
    //   async getUserStats(): Promise<{
    //     totalUsers: number;
    //     totalDoctors: number;
    //     totalPatients: number;
    //     blockedUsers: number;
    //   }> {
    //     const [totalUsers, totalDoctors, totalPatients, blockedUsers] = await Promise.all([
    //       UserModel.countDocuments({}),
    //       UserModel.countDocuments({ role: UserRole.SERVICE_PROVIDER }),
    //       UserModel.countDocuments({ role: UserRole.USER }),
    //       UserModel.countDocuments({ isBlocked: true })
    //     ]);
    //     return {
    //       totalUsers,
    //       totalDoctors,
    //       totalPatients,
    //       blockedUsers
    //     };
    //   }
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
