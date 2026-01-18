import { IUserModel } from "../../models/interfaces/user.model.interface";
import { IAdminDashboardStats } from "../../repositories/interface/admin.repository.interface";

export interface IAdminService {
	getDashboardStats(adminUserId: string): Promise<IAdminDashboardStats>;
	getRevenueSummary(adminUserId: string): Promise<{
		totalIncome: number;
		totalSubscriptions: number;
		activeSubscriptions: number;
		expiredSubscriptions: number;
		revenueThisMonth: number;
		revenueLastMonth: number;
	}>;
	getIncome(
		adminUserId: string,
		options: {
			range?: "7d" | "30d" | "12m" | "custom";
			from?: string;
			to?: string;
			groupBy?: "day" | "month";
		}
	): Promise<Array<{ period: string; totalIncome: number; totalSubscriptions: number }>>;
	getProviderById(adminUserId: string, providerId: string): Promise<Omit<IUserModel, "password">>;
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
