import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../http/auth.middleware";

export interface IAdminController {
	getDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
	getRevenueSummary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
	getIncome(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
	getProviderById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
	listProviders(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
	listUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
	approveProvider(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
	rejectProvider(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
	setUserBlocked(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
	setProviderBlocked(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
