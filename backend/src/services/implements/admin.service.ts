import { UserRole } from "../../constants/roles";
import { AppError, NotFoundError, ValidationAppError } from "../../http/errors";
import { IUserRepository } from "../../repositories/interface/user.repository.interface";
import {
	IAdminRepository,
} from "../../repositories/interface/admin.repository.interface";
import { IAdminService } from "../interfaces/admin.service.interface";

export class AdminService implements IAdminService {
	constructor(
		private readonly adminRepo: IAdminRepository,
		private readonly userRepo: IUserRepository
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
