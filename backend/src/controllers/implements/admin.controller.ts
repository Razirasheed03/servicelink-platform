import { Response, NextFunction } from "express";
import { ResponseHelper } from "../../http/ResponseHelper";
import { HttpResponse } from "../../constants/MessageConstant";
import { AuthenticatedRequest } from "../../http/auth.middleware";
import { IAdminService } from "../../services/interfaces/admin.service.interface";
import { IAdminController } from "../interfaces/IAdminController";

export class AdminController implements IAdminController {
	constructor(private readonly adminService: IAdminService) {}

	getDashboard = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
		try {
			const adminUserId = req.userId!;
			const stats = await this.adminService.getDashboardStats(adminUserId);
			ResponseHelper.ok(res, stats, HttpResponse.RESOURCE_FOUND);
			return;
		} catch (err) {
			next(err);
		}
	};

	getRevenueSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
		try {
			const adminUserId = req.userId!;
			const summary = await this.adminService.getRevenueSummary(adminUserId);
			ResponseHelper.ok(res, summary, HttpResponse.RESOURCE_FOUND);
			return;
		} catch (err) {
			next(err);
		}
	};

	getIncome = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
		try {
			const adminUserId = req.userId!;
			const { range, from, to, groupBy } = req.query as Record<string, string | undefined>;
			const data = await this.adminService.getIncome(adminUserId, {
				range: range as "7d" | "30d" | "12m" | "custom" | undefined,
				from,
				to,
				groupBy: groupBy as "day" | "month" | undefined,
			});
			ResponseHelper.ok(res, data, HttpResponse.RESOURCE_FOUND);
			return;
		} catch (err) {
			next(err);
		}
	};

	getProviderById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
		try {
			const adminUserId = req.userId!;
			const { providerId } = req.params as { providerId: string };
			const provider = await this.adminService.getProviderById(adminUserId, providerId);
			ResponseHelper.ok(res, { provider }, HttpResponse.RESOURCE_FOUND);
			return;
		} catch (err) {
			next(err);
		}
	};

	listProviders = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
		try {
			const adminUserId = req.userId!;
			const { page, limit } = req.query as Record<string, string | undefined>;
			const data = await this.adminService.listProviders(adminUserId, {
				page: page ? Number(page) : undefined,
				limit: limit ? Number(limit) : undefined,
			});
			ResponseHelper.ok(res, data, HttpResponse.RESOURCE_FOUND);
			return;
		} catch (err) {
			next(err);
		}
	};

	listUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
		try {
			const adminUserId = req.userId!;
			const { page, limit } = req.query as Record<string, string | undefined>;
			const data = await this.adminService.listUsers(adminUserId, {
				page: page ? Number(page) : undefined,
				limit: limit ? Number(limit) : undefined,
			});
			ResponseHelper.ok(res, data, HttpResponse.RESOURCE_FOUND);
			return;
		} catch (err) {
			next(err);
		}
	};

	approveProvider = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
		try {
			const adminUserId = req.userId!;
			const { providerId } = req.params as { providerId: string };
			const updated = await this.adminService.approveProvider(adminUserId, providerId);
			ResponseHelper.ok(res, { provider: updated }, HttpResponse.RESOURCE_UPDATED);
			return;
		} catch (err) {
			next(err);
		}
	};

	rejectProvider = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
		try {
			const adminUserId = req.userId!;
			const { providerId } = req.params as { providerId: string };
			const { reason } = req.body as { reason: string };
			const updated = await this.adminService.rejectProvider(adminUserId, providerId, reason);
			ResponseHelper.ok(res, { provider: updated }, HttpResponse.RESOURCE_UPDATED);
			return;
		} catch (err) {
			next(err);
		}
	};

	setUserBlocked = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
		try {
			const adminUserId = req.userId!;
			const { userId } = req.params as { userId: string };
			const { isBlocked } = req.body as { isBlocked: boolean };
			const updated = await this.adminService.setUserBlocked(adminUserId, userId, !!isBlocked);
			ResponseHelper.ok(res, { user: updated }, HttpResponse.RESOURCE_UPDATED);
			return;
		} catch (err) {
			next(err);
		}
	};

	setProviderBlocked = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
		try {
			const adminUserId = req.userId!;
			const { providerId } = req.params as { providerId: string };
			const { isBlocked } = req.body as { isBlocked: boolean };
			const updated = await this.adminService.setProviderBlocked(adminUserId, providerId, !!isBlocked);
			ResponseHelper.ok(res, { provider: updated }, HttpResponse.RESOURCE_UPDATED);
			return;
		} catch (err) {
			next(err);
		}
	};
}
