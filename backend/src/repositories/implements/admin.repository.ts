import { UserRole } from "../../constants/roles";
import { UserModel } from "../../models/implements/user.model";
import { IUserModel } from "../../models/interfaces/user.model.interface";
import {
	IAdminDashboardStats,
	IAdminRepository,
} from "../interface/admin.repository.interface";

export class AdminRepository implements IAdminRepository {
	async getDashboardStats(): Promise<IAdminDashboardStats> {
		const [
			totalUsers,
			totalProviders,
			verifiedProviders,
			pendingVerifications,
		] = await Promise.all([
			UserModel.countDocuments({ role: UserRole.USER }),
			UserModel.countDocuments({ role: UserRole.SERVICE_PROVIDER }),
			UserModel.countDocuments({
				role: UserRole.SERVICE_PROVIDER,
				isBlocked: false,
				isVerified: true,
				verificationStatus: "approved",
			}),
			UserModel.countDocuments({
				role: UserRole.SERVICE_PROVIDER,
				isBlocked: false,
				verificationStatus: "pending",
			}),
		]);

		return {
			totalUsers,
			totalProviders,
			verifiedProviders,
			pendingVerifications,
		};
	}

	async listProviders(options: {
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
		};

		const [items, total] = await Promise.all([
			UserModel.find(filters)
				.select("-password")
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean(),
			UserModel.countDocuments(filters),
		]);

		return {
			providers: items as unknown as Omit<IUserModel, "password">[],
			total,
			page,
			totalPages: Math.max(1, Math.ceil(total / limit)),
		};
	}

	async listUsers(options: {
		page?: number;
		limit?: number;
	}): Promise<{
		users: Omit<IUserModel, "password">[];
		total: number;
		page: number;
		totalPages: number;
	}> {
		const page = Math.max(1, options.page || 1);
		const limit = Math.max(1, Math.min(50, options.limit || 12));
		const skip = (page - 1) * limit;

		const filters: any = {
			role: UserRole.USER,
		};

		const [items, total] = await Promise.all([
			UserModel.find(filters)
				.select("-password")
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean(),
			UserModel.countDocuments(filters),
		]);

		return {
			users: items as unknown as Omit<IUserModel, "password">[],
			total,
			page,
			totalPages: Math.max(1, Math.ceil(total / limit)),
		};
	}

	async approveProvider(providerId: string): Promise<Omit<IUserModel, "password"> | null> {
		const updated = await UserModel.findOneAndUpdate(
			{ _id: providerId, role: UserRole.SERVICE_PROVIDER },
			{
				$set: {
					isVerified: true,
					verificationStatus: "approved",
				},
				$unset: { verificationReason: "" },
			},
			{ new: true }
		).select("-password");

		return updated ? (updated.toObject() as Omit<IUserModel, "password">) : null;
	}

	async rejectProvider(
		providerId: string,
		reason: string
	): Promise<Omit<IUserModel, "password"> | null> {
		const updated = await UserModel.findOneAndUpdate(
			{ _id: providerId, role: UserRole.SERVICE_PROVIDER },
			{
				$set: {
					isVerified: false,
					verificationStatus: "rejected",
					verificationReason: reason,
				},
			},
			{ new: true }
		).select("-password");

		return updated ? (updated.toObject() as Omit<IUserModel, "password">) : null;
	}

	async setUserBlocked(userId: string, isBlocked: boolean): Promise<Omit<IUserModel, "password"> | null> {
		const updated = await UserModel.findOneAndUpdate(
			{ _id: userId, role: UserRole.USER },
			{ $set: { isBlocked } },
			{ new: true }
		).select("-password");

		return updated ? (updated.toObject() as Omit<IUserModel, "password">) : null;
	}

	async setProviderBlocked(
		providerId: string,
		isBlocked: boolean
	): Promise<Omit<IUserModel, "password"> | null> {
		const updated = await UserModel.findOneAndUpdate(
			{ _id: providerId, role: UserRole.SERVICE_PROVIDER },
			{ $set: { isBlocked } },
			{ new: true }
		).select("-password");

		return updated ? (updated.toObject() as Omit<IUserModel, "password">) : null;
	}
}
