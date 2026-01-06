import { Request, Response, NextFunction } from "express";
import { IUserService } from "../../services/interfaces/user.service.interface";
import { ResponseHelper } from "../../http/ResponseHelper";
import { HttpResponse } from "../../constants/MessageConstant";
import { AuthenticatedRequest } from "../../http/auth.middleware";
import { IUserController } from "../interfaces/IUserController";

export class UserController implements IUserController {
  constructor(private readonly _userService: IUserService) {}

  getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;
      const user = await this._userService.getProfile(userId);
      ResponseHelper.ok(res, { user }, HttpResponse.RESOURCE_FOUND);
      return;
    } catch (err) {
      next(err);
    }
  };

  updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;
      const updated = await this._userService.updateProfile(userId, req.body);
      ResponseHelper.ok(res, { user: updated }, HttpResponse.RESOURCE_UPDATED);
      return;
    } catch (err) {
      next(err);
    }
  };

  listProviders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { search, serviceType, page, limit } = req.query as Record<string, string | undefined>;
      const parsed = await this._userService.listProviders({
        search,
        serviceType,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });
      ResponseHelper.ok(res, parsed, HttpResponse.RESOURCE_FOUND);
      return;
    } catch (err) {
      next(err);
    }
  };

  getProviderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const provider = await this._userService.getProviderById(id);
      if (!provider) {
        ResponseHelper.notFound(res, HttpResponse.USER_NOT_FOUND);
        return;
      }
      ResponseHelper.ok(res, { provider }, HttpResponse.RESOURCE_FOUND);
      return;
    } catch (err) {
      next(err);
    }
  };

	reapplyVerification = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
		try {
			const userId = req.userId!;
			const updated = await this._userService.reapplyVerification(userId);
			if (!updated) {
				ResponseHelper.notFound(res, HttpResponse.USER_NOT_FOUND);
				return;
			}
			ResponseHelper.ok(res, { user: updated }, HttpResponse.RESOURCE_UPDATED);
			return;
		} catch (err) {
			next(err);
		}
	};
}
