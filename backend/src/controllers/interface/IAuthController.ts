import { NextFunction, Request, Response } from "express";

export interface IAuthController {
  signup: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  verifyOtp: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  resendOtp: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  refreshToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  googleLoginWithToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  googleRedirect: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  googleCallback: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  forgotPassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  resetPassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}