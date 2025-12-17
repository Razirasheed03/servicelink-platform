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

  async findPublicById(id: string): Promise<Omit<IUserModel, "password"> | null> {
    const user = await this.model.findById(id).select("-password");
    return user ? (user.toObject() as Omit<IUserModel, "password">) : null;
  }

  async updateByIdPublic(
    id: string,
    update: Partial<IUserModel>
  ): Promise<Omit<IUserModel, "password"> | null> {
    const updated = await this.model
      .findByIdAndUpdate(id, { $set: update }, {
        new: true,
        runValidators: true,
        context: "query",
      })
      .select("-password");
    return updated ? (updated.toObject() as Omit<IUserModel, "password">) : null;
  }

  async listProviders(options: {
    search?: string;
    serviceType?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    providers: Omit<IUserModel, "password">[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(50, options.limit || 12));
    const skip = (page - 1) * limit;

    const filters: any = {
      role: UserRole.SERVICE_PROVIDER,
      isBlocked: false,
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

    const [items, total] = await Promise.all([
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
      providers: items as Omit<IUserModel, "password">[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

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