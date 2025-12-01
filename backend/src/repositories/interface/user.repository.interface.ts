import { IUserModel } from "../../models/interfaces/user.model.interface";
export interface IUserRepository {
  createUser(user: IUserModel): Promise<IUserModel>;
  findByEmail(email: string): Promise<IUserModel | null>;
  findById(id: string): Promise<IUserModel | null>;

//   getAllUsers(
//     page?: number,
//     limit?: number,
//     search?: string
//   ): Promise<{
//     users: Omit<IUserModel, "password">[];
//     total: number;
//     page: number;
//     totalPages: number;
//   }>;

  updateUserBlockStatus(
    userId: string,
    isBlocked: boolean
  ): Promise<Omit<IUserModel, "password">>;

  deleteUser(userId: string): Promise<void>;

//   getUserStats(): Promise<{
//     totalUsers: number;
//     totalDoctors: number;
//     totalPatients: number;
//     blockedUsers: number;
//   }>;
}