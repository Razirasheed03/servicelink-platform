import { IUserModel } from "../../models/interfaces/user.model.interface";
import { IAdminDashboardStats } from "../../repositories/interface/admin.repository.interface";

export interface IAdminService {
	getDashboardStats(adminUserId: string): Promise<IAdminDashboardStats>;
	listProviders(
		adminUserId: string,
		options: { page?: number; limit?: number }
	): Promise<{
		providers: Omit<IUserModel, "password">[];
		total: number;
		page: number;
		totalPages: number;
	}>;
	listUsers(
		adminUserId: string,
		options: { page?: number; limit?: number }
	): Promise<{
		users: Omit<IUserModel, "password">[];
		total: number;
		page: number;
		totalPages: number;
	}>;
	approveProvider(adminUserId: string, providerId: string): Promise<Omit<IUserModel, "password">>;
	rejectProvider(
		adminUserId: string,
		providerId: string,
		reason: string
	): Promise<Omit<IUserModel, "password">>;
	setUserBlocked(adminUserId: string, userId: string, isBlocked: boolean): Promise<Omit<IUserModel, "password">>;
	setProviderBlocked(
		adminUserId: string,
		providerId: string,
		isBlocked: boolean
	): Promise<Omit<IUserModel, "password">>;
}
