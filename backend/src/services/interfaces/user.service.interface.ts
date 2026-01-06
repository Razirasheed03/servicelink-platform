import { IUserModel } from "../../models/interfaces/user.model.interface";

export type UpdateProfileInput = Partial<Pick<IUserModel,
  |"username"
  | "phone"
  | "serviceType"
  | "location"
  | "experience"
	| "consultationFee"
>>;

export interface IUserService {
  getProfile(userId: string): Promise<Omit<IUserModel, "password"> | null>;
  updateProfile(userId: string, payload: UpdateProfileInput): Promise<Omit<IUserModel, "password"> | null>;
  listProviders(options: {
    search?: string;
    serviceType?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    providers: Omit<IUserModel, "password">[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  getProviderById(id: string): Promise<Omit<IUserModel, "password"> | null>;
  reapplyVerification(providerUserId: string): Promise<Omit<IUserModel, "password"> | null>;
}