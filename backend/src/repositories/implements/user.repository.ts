// src/repositories/implements/UserRepository.ts
import { BaseRepository } from "../baseRepository";
import { IUserRepository } from "../interface/user.repository.interface";

import { UserModel } from "../../models/implements/user.model";
import { UserRole } from "../../constants/roles";
import { IUserModel } from "../../models/interfaces/user.model.interface";

export class UserRepository extends BaseRepository<IUserModel> implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  async createUser(user: IUserModel): Promise<IUserModel> {
    return await super.create(user);
  }

  async findByEmail(email: string): Promise<IUserModel | null> {
    return await this.model.findOne({ email });
  }

  async findById(id: string): Promise<IUserModel | null> {
    return await this.model.findById(id);
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

  async updateUserBlockStatus(userId: string, isBlocked: boolean): Promise<Omit<IUserModel, "password">> {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { isBlocked },
      { new: true }
    ).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    return user.toObject() as Omit<IUserModel, "password">;
  }

  async deleteUser(userId: string): Promise<void> {
    const result = await UserModel.findByIdAndDelete(userId);
    if (!result) {
      throw new Error("User not found");
    }
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
   async updateUsername(userId: string, username: string) {
    const updated = await this.model
      .findByIdAndUpdate(
        userId,
        { $set: { username } },
        { new: true, runValidators: true, context: "query" }
      )
      .select("-password");
    return updated ? updated.toObject() : null;
  }
}