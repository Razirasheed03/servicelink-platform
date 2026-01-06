import { IUserModel } from "../../models/interfaces/user.model.interface";

export interface IAdminDashboardStats {
	totalUsers: number;
	totalProviders: number;
	verifiedProviders: number;
	pendingVerifications: number;
}

export interface IAdminRepository {
	getDashboardStats(): Promise<IAdminDashboardStats>;
	listProviders(options: {
		page?: number;
		limit?: number;
	}): Promise<{
		providers: Omit<IUserModel, "password">[];
		total: number;
		page: number;
		totalPages: number;
	}>;
	listUsers(options: {
		page?: number;
		limit?: number;
	}): Promise<{
		users: Omit<IUserModel, "password">[];
		total: number;
		page: number;
		totalPages: number;
	}>;
	approveProvider(providerId: string): Promise<Omit<IUserModel, "password"> | null>;
	rejectProvider(providerId: string, reason: string): Promise<Omit<IUserModel, "password"> | null>;
	setUserBlocked(userId: string, isBlocked: boolean): Promise<Omit<IUserModel, "password"> | null>;
	setProviderBlocked(providerId: string, isBlocked: boolean): Promise<Omit<IUserModel, "password"> | null>;
}
