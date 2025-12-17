import { Model } from "mongoose";

import { User } from "../../schema/user.schema";
import { IUserModel } from "../interfaces/user.model.interface";

export const UserModel: Model<IUserModel> = User