import { IUserService, UpdateProfileInput } from "../interfaces/user.service.interface";
import { IUserRepository } from "../../repositories/interface/user.repository.interface";
import { IUserModel } from "../../models/interfaces/user.model.interface";
import { UserRole } from "../../constants/roles";
import { AppError } from "../../http/errors";

export class UserService implements IUserService {
  constructor(private readonly _userRepo: IUserRepository) {}

  async getProfile(userId: string): Promise<Omit<IUserModel, "password"> | null> {
    return this._userRepo.findPublicById(userId);
  }

  async updateProfile(
    userId: string,
    payload: UpdateProfileInput
  ): Promise<Omit<IUserModel, "password"> | null> {
    const user = await this._userRepo.findById(userId);
    if (!user) return null;

    const isProvider = user.role === UserRole.SERVICE_PROVIDER;

    // Enforce: location and experience only for service providers
    const update: Partial<IUserModel> = {};
    if (payload.username !== undefined) update.username = payload.username;
    if (payload.phone !== undefined) update.phone = payload.phone;
    if (payload.serviceType !== undefined) update.serviceType = payload.serviceType;

    if (payload.location !== undefined || payload.experience !== undefined) {
      if (!isProvider) {
        // Ignore disallowed fields if not a provider
        // Alternatively, could throw an error; requirement is they are only for providers
      } else {
        if (payload.location !== undefined) update.location = payload.location;
        if (payload.experience !== undefined) update.experience = payload.experience;
      }
    }

    return this._userRepo.updateByIdPublic(userId, update);
  }

  async listProviders(options: {
    search?: string;
    serviceType?: string;
    page?: number;
    limit?: number;
  }) {
    return this._userRepo.listProviders(options);
  }

  async getProviderById(id: string) {
    const user = await this._userRepo.findPublicById(id);
    if (!user) return null;
    const isProvider = (user as any).role === UserRole.SERVICE_PROVIDER;
    const blocked = !!(user as any).isBlocked;
    const verified = !!(user as any).isVerified;
    const status = (user as any).verificationStatus as string | undefined;
    if (!isProvider || blocked) return null;
		if (!verified || status !== "approved") return null;
    return user;
  }

	async reapplyVerification(providerUserId: string): Promise<Omit<IUserModel, "password"> | null> {
		const user = await this._userRepo.findById(providerUserId);
		if (!user) return null;
		if (user.role !== UserRole.SERVICE_PROVIDER) {
			throw new AppError(403, "FORBIDDEN", "Forbidden");
		}
		if (user.isBlocked) {
			throw new AppError(403, "FORBIDDEN", "Forbidden");
		}
		return this._userRepo.updateByIdPublic(providerUserId, {
			isVerified: false,
			verificationStatus: "pending",
			verificationReason: undefined,
		});
	}
}
