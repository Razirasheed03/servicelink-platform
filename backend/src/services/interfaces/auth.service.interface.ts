//services/interfaces/auth.service.interface.ts
import { IUserModel } from "../../models/interfaces/user.model.interface";

export interface IAuthService {
  signup(user: Partial<IUserModel>): Promise<{ success:boolean,message: string }>;
  verifyOtp(email: string, otp: string): Promise<{ accessToken: string; refreshToken: string; user: IUserModel }>;
  resendOtp(email: string): Promise<void>;
  refreshToken(refreshToken: string): Promise<{ accessToken: string }>;
  login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; user: IUserModel }>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(id: string, token: string, newPassword: string): Promise<void>;
   googleLogin(idToken: string): Promise<{ accessToken: string; refreshToken: string; user: any }>;
 
}