import { IUserModel } from "../../models/interfaces/user.model.interface";
export interface IUserRepository {
  createUser(user: IUserModel): Promise<IUserModel>;
  findByEmail(email: string): Promise<IUserModel | null>;
  findById(id: string): Promise<IUserModel | null>;
  findPublicById(id: string): Promise<Omit<IUserModel, "password"> | null>;
  updateByIdPublic(
    id: string,
    update: Partial<IUserModel>
  ): Promise<Omit<IUserModel, "password"> | null>;

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

  updateUserBlockStatus(
    userId: string,
    isBlocked: boolean
  ): Promise<Omit<IUserModel, "password">>;

  deleteUser(userId: string): Promise<void>;

  updateUsername(
    userId: string,
    username: string
  ): Promise<Omit<IUserModel, "password"> | null>;
}