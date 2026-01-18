import { UserRole } from "../../constants/roles";
import { AppError, NotFoundError, ValidationAppError } from "../../http/errors";
import { IUserRepository } from "../../repositories/interface/user.repository.interface";
import {
	IAdminRepository,
} from "../../repositories/interface/admin.repository.interface";
import { IAdminService } from "../interfaces/admin.service.interface";
import { ISubscriptionRepository } from "../../repositories/interface/subscription.repository.interface";

export class AdminService implements IAdminService {
	constructor(
		private readonly adminRepo: IAdminRepository,
		private readonly userRepo: IUserRepository,
		private readonly subscriptionRepo: ISubscriptionRepository
	) {}

	private async assertAdmin(userId: string): Promise<void> {
		const user = await this.userRepo.findById(userId);
		if (!user) throw new AppError(401, "UNAUTHORIZED", "Unauthorized");
		if (user.role !== UserRole.ADMIN) throw new AppError(403, "FORBIDDEN", "Forbidden");
	}

	async getDashboardStats(adminUserId: string) {
		await this.assertAdmin(adminUserId);
		return this.adminRepo.getDashboardStats();
	}

	async getRevenueSummary(adminUserId: string) {
		await this.assertAdmin(adminUserId);
		return this.subscriptionRepo.getIncomeSummary();
	}

	async getIncome(
		adminUserId: string,
		options: {
			range?: "7d" | "30d" | "12m" | "custom";
			from?: string;
			to?: string;
			groupBy?: "day" | "month";
		}
	) {
		await this.assertAdmin(adminUserId);

		const groupBy = options.groupBy || (options.range === "12m" ? "month" : "day");
		const now = new Date();
		let from: Date;
		let to: Date;

		switch (options.range) {
			case "7d":
				to = now;
				from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
				break;
			case "30d":
				to = now;
				from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
				break;
			case "12m":
				to = now;
				from = new Date(Date.UTC(now.getUTCFullYear() - 1, now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
				break;
			case "custom":
				if (!options.from || !options.to) throw new ValidationAppError("from and to are required for custom range");
				from = new Date(options.from);
				to = new Date(options.to);
				if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) throw new ValidationAppError("Invalid date range");
				break;
			default:
				to = now;
				from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
		}

		// Normalize to UTC boundaries
		if (groupBy === "day") {
			from = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate(), 0, 0, 0));
			to = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate(), 23, 59, 59, 999));
		} else {
			from = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), 1, 0, 0, 0));
			to = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth() + 1, 0, 23, 59, 59, 999));
		}

		return this.subscriptionRepo.getIncomeSeries({ from, to, groupBy });
	}

	async getProviderById(adminUserId: string, providerId: string) {
		await this.assertAdmin(adminUserId);
		const provider = await this.adminRepo.getProviderById(providerId);
		if (!provider) throw new NotFoundError("Provider not found");
		return provider;
	}

	async listProviders(adminUserId: string, options: { page?: number; limit?: number }) {
		await this.assertAdmin(adminUserId);
		return this.adminRepo.listProviders(options);
	}

	async listUsers(adminUserId: string, options: { page?: number; limit?: number }) {
		await this.assertAdmin(adminUserId);
		return this.adminRepo.listUsers(options);
	}

	async approveProvider(adminUserId: string, providerId: string) {
		await this.assertAdmin(adminUserId);
		const updated = await this.adminRepo.approveProvider(providerId);
		if (!updated) throw new NotFoundError("Provider not found");
		return updated;
	}

	async rejectProvider(adminUserId: string, providerId: string, reason: string) {
		await this.assertAdmin(adminUserId);
		if (!reason || !reason.trim()) throw new ValidationAppError("Rejection reason is required");
		const updated = await this.adminRepo.rejectProvider(providerId, reason.trim());
		if (!updated) throw new NotFoundError("Provider not found");
		return updated;
	}

	async setUserBlocked(adminUserId: string, userId: string, isBlocked: boolean) {
		await this.assertAdmin(adminUserId);
		const updated = await this.adminRepo.setUserBlocked(userId, isBlocked);
		if (!updated) throw new NotFoundError("User not found");
		return updated;
	}

	async setProviderBlocked(adminUserId: string, providerId: string, isBlocked: boolean) {
		await this.assertAdmin(adminUserId);
		const updated = await this.adminRepo.setProviderBlocked(providerId, isBlocked);
		if (!updated) throw new NotFoundError("Provider not found");
		return updated;
	}
}
