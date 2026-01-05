import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../../http/auth.middleware";

export interface IUserController {
  getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
  updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
  listProviders(req: Request, res: Response, next: NextFunction): Promise<void>;
  getProviderById(req: Request, res: Response, next: NextFunction): Promise<void>;
}