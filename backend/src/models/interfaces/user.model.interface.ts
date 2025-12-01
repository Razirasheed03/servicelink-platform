//models/interface/user.model.interface.ts
import { Document } from "mongoose";
import { UserRole } from "../../constants/roles";


export interface IUserModel extends Document {
  username: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
  serviceType?: string;
  isBlocked?: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}