import { AdminController } from "../controllers/implements/admin.controller";
import { AdminService } from "../services/implements/admin.service";
import { AdminRepository } from "../repositories/implements/admin.repository";
import { UserRepository } from "../repositories/implements/user.repository";

export const adminController = new AdminController(
	new AdminService(new AdminRepository(), new UserRepository())
);
